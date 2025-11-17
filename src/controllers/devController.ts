import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const createAdmin = async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed' });
    const { name = 'Admin', email = 'admin@example.com', password = 'adminpass' } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: 'admin' } as any);
    res.json({ user });
};
