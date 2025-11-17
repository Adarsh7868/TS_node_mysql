import { Request, Response } from 'express';
import Employee from '../models/Employee';
import Payroll from '../models/Payroll';
import { calculateSalaryForEmployee } from './salaryController';

export const distributePayroll = async (req: Request, res: Response) => {
    const { month } = req.body;
    if (!month) return res.status(400).json({ message: 'month required' });
    const employees = await Employee.findAll();
    const results = [] as any[];
    let totalPayout = 0;
    for (const emp of employees) {
        const calc = await calculateSalaryForEmployee(emp.id, month);
        let payroll = await Payroll.findOne({ where: { employeeId: emp.id, month } });
        if (!payroll) {
            payroll = await Payroll.create({
                employeeId: emp.id,
                month,
                grossSalary: calc.gross,
                tax: calc.tax,
                pf: calc.pf,
                totalSalary: calc.totalSalary,
                netSalary: calc.netSalary,
                distributed: true,
            });
        } else {
            payroll.grossSalary = calc.gross as any;
            payroll.tax = calc.tax as any;
            payroll.pf = calc.pf as any;
            payroll.totalSalary = calc.totalSalary as any;
            payroll.netSalary = calc.netSalary as any;
            payroll.distributed = true;
            await payroll.save();
        }
        totalPayout += Number(payroll.netSalary);
        results.push(payroll);
    }
    res.json({ totalPayout: Number(totalPayout.toFixed(2)), payrolls: results });
};

export const payrollHistory = async (req: Request, res: Response) => {
    const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
    const payrolls = await Payroll.findAll({ where: { month } });
    res.json(payrolls);
};
