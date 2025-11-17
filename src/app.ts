import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import employeesRoutes from './routes/employees';
import attendanceRoutes from './routes/attendance';
import salaryRoutes from './routes/salary';
import payrollRoutes from './routes/payroll';
import devRoutes from './routes/dev';
import { sequelize } from './config/database';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/employees', employeesRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/salary', salaryRoutes);
app.use('/payroll', payrollRoutes);
app.use('/dev', devRoutes);

app.get('/', (req: Request, res: Response) => res.json({ message: 'TS Node + MYSQL + Sequelize' }));

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
}).catch(err => console.error('DB sync error', err));

export default app;
