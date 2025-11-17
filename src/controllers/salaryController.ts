import { Request, Response } from 'express';
import Employee from '../models/Employee';
import Attendance from '../models/Attendance';
import Payroll from '../models/Payroll';
import { Op } from 'sequelize';

function countWorkingDays(year: number, month: number) {
    const date = new Date(year, month - 1, 1);
    let count = 0;
    while (date.getMonth() === month - 1) {
        const day = date.getDay();
        if (day !== 0 && day !== 6) count++;
        date.setDate(date.getDate() + 1);
    }
    return count;
}

function calcTaxAnnual(annualIncome: number) {

    let tax = 0;
    let remaining = annualIncome;
    if (remaining <= 250000) return 0;
    remaining -= 250000;
    const slab1 = Math.min(250000, remaining);
    tax += slab1 * 0.05;
    remaining -= slab1;
    if (remaining > 0) {
        const slab2 = Math.min(500000, remaining);
        tax += slab2 * 0.2;
        remaining -= slab2;
    }
    if (remaining > 0) {
        tax += remaining * 0.3;
    }
    return tax;
}

export const calculateSalaryForEmployee = async (employeeId: number, monthStr: string) => {
    const [yearStr, monthOnly] = monthStr.split('-');
    const year = Number(yearStr);
    const month = Number(monthOnly);
    const employee = await Employee.findByPk(employeeId);
    if (!employee) throw new Error('Employee not found');
    const basic = Number(employee.basicSalary);
    const hra = Number(employee.hra);
    const allowances = Number(employee.allowances);
    const otherDeductions = Number(employee.otherDeductions || 0);

    const gross = basic + hra + allowances;
    const workingDays = countWorkingDays(year, month);

    const monthPrefix = `${yearStr}-${String(month).padStart(2, '0')}`;
    const attendances = await Attendance.findAll({
        where: {
            employeeId,
            date: { [Op.like]: `${monthPrefix}%` },
        },
    });

    const atts = attendances as any[];

    let fullDays = 0;
    let halfDays = 0;
    for (const a of atts) {
        const hrs = Number(a.hoursWorked);
        if (hrs >= 8) fullDays++;
        else fullDays += 0; // if hours < 8 we'll count later as half day
    }

    // Count half-days explicitly: those attendances with hours > 0 and < 8
    halfDays = atts.filter(a => Number(a.hoursWorked) > 0 && Number(a.hoursWorked) < 8).length;
    // Adjust fullDays in case some records were <8 (avoid double counting)
    fullDays = atts.filter(a => Number(a.hoursWorked) >= 8).length;

    const dailyWage = gross / Math.max(workingDays, 1);
    const fullDaySalary = dailyWage;
    const halfDaySalary = dailyWage / 2;
    const totalSalary = fullDays * fullDaySalary + halfDays * halfDaySalary;

    // Tax: compute annualized gross and calculate monthly tax
    const annualGross = gross * 12;
    const annualTax = calcTaxAnnual(annualGross);
    const monthlyTax = annualTax / 12;

    const pf = basic * 0.12; // monthly PF on basic? If basic is monthly

    const netSalary = totalSalary - monthlyTax - pf - otherDeductions;

    return {
        employeeId,
        month: monthStr,
        gross: Number(gross.toFixed(2)),
        tax: Number(monthlyTax.toFixed(2)),
        pf: Number(pf.toFixed(2)),
        totalSalary: Number(totalSalary.toFixed(2)),
        netSalary: Number(netSalary.toFixed(2)),
        fullDays,
        halfDays,
        workingDays,
    };
};

export const calculateSalary = async (req: Request, res: Response) => {
    const { employeeId, month } = req.body;
    if (!employeeId || !month) return res.status(400).json({ message: 'employeeId and month required' });
    try {
        const result = await calculateSalaryForEmployee(Number(employeeId), month);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getSalaryForEmployee = async (req: Request, res: Response) => {
    const employeeId = Number(req.params.employeeId);
    const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
    try {
        // check if payroll entry exists
        let payroll = await Payroll.findOne({ where: { employeeId, month } });
        if (!payroll) {
            const calc = await calculateSalaryForEmployee(employeeId, month);
            payroll = await Payroll.create({
                employeeId,
                month,
                grossSalary: calc.gross,
                tax: calc.tax,
                pf: calc.pf,
                totalSalary: calc.totalSalary,
                netSalary: calc.netSalary,
            });
        }
        res.json(payroll);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};
