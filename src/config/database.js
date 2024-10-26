import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const dbConnection = new Sequelize(
  process.env.DATABASE,
  process.env.ROOT,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    port: process.env.PORT || 3306,
  }
);

export default dbConnection;
