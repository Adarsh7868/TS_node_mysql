import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ message: 'Logged in' });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};
