import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


let sequelize: Sequelize;

const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const database = process.env.DB_NAME || 'ts_sql';
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASS || '';

sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: { connectTimeout: 60000 },
});

export { sequelize };
export default sequelize;
