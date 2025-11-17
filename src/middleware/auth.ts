import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers['authorization']?.toString().replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const authorize = (roles: string[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
