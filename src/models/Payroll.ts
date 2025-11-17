import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PayrollAttributes {
    id: number;
    employeeId: number;
    month: string; // YYYY-MM
    grossSalary: number;
    tax: number;
    pf: number;
    totalSalary: number;
    netSalary: number;
    distributed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PayrollCreationAttributes extends Optional<PayrollAttributes, 'id' | 'distributed'> { }

export class Payroll extends Model<PayrollAttributes, PayrollCreationAttributes> implements PayrollAttributes {
    public id!: number;
    public employeeId!: number;
    public month!: string;
    public grossSalary!: number;
    public tax!: number;
    public pf!: number;
    public totalSalary!: number;
    public netSalary!: number;
    public distributed!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Payroll.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        employeeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        month: { type: DataTypes.STRING, allowNull: false },
        grossSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        tax: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        pf: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        totalSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        netSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        distributed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { sequelize, tableName: 'payrolls', timestamps: false }
);

export default Payroll;
