import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Employee from '../models/Employee';

export const createEmployee = async (req: Request, res: Response) => {
    const { name, email, password, basicSalary = 0, hra = 0, allowances = 0, otherDeductions = 0, role = 'employee' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already used' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    const employee = await Employee.create({ userId: user.id, basicSalary, hra, allowances, otherDeductions });
    res.status(201).json({ user, employee });
};

export const getEmployee = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const employee = await Employee.findByPk(id, { include: ['user'] as any });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
};
