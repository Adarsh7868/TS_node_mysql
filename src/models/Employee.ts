import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

interface EmployeeAttributes {
    id: number;
    userId: number;
    basicSalary: number;
    hra: number;
    allowances: number;
    otherDeductions: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id'> { }

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
    public id!: number;
    public userId!: number;
    public basicSalary!: number;
    public hra!: number;
    public allowances!: number;
    public otherDeductions!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Employee.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        basicSalary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        hra: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        allowances: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
        otherDeductions: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    },
    { sequelize, tableName: 'employees', timestamps: false }
);

Employee.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Employee;
