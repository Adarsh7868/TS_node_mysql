import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';

export const markAttendance = async (req: Request, res: Response) => {
    const { employeeId, date, hoursWorked } = req.body;
    if (!employeeId || !date || hoursWorked == null) return res.status(400).json({ message: 'employeeId, date, hoursWorked required' });
    const emp = await Employee.findByPk(employeeId);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    const att = await Attendance.create({ employeeId, date, hoursWorked });
    res.status(201).json(att);
};
