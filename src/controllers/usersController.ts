import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } as any });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to list users' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } as any });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get user' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role = 'employee' } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password are required' });
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already in use' });
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash, role } as any);
        const out = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user as any).role,
        };
        res.status(201).json(out);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { name, email, password, role } = req.body;
        if (name) user.name = name as any;
        if (email) user.email = email as any;
        if (role) (user as any).role = role;
        if (password) user.password = await bcrypt.hash(password, 10) as any;
        await (user as any).save();
        const out = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user as any).role,
        };
        res.json(out);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await (user as any).destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
};
