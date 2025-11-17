import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type UserRole = 'admin' | 'hr' | 'employee';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: UserRole;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM('admin', 'hr', 'employee'), allowNull: false, defaultValue: 'employee' },
    },
    { sequelize, tableName: 'users', timestamps: false }
);

export default User;
