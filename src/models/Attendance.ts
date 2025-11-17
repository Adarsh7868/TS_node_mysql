import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AttendanceAttributes {
    id: number;
    employeeId: number;
    date: string;
    hoursWorked: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AttendanceCreationAttributes extends Optional<AttendanceAttributes, 'id'> { }

export class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
    public id!: number;
    public employeeId!: number;
    public date!: string;
    public hoursWorked!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Attendance.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        employeeId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        date: { type: DataTypes.STRING, allowNull: false },
        hoursWorked: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    },
    { sequelize, tableName: 'attendances', timestamps: false }
);

export default Attendance;
