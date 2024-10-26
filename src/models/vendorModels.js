import { Sequelize } from "sequelize";
import dbConnection from "../config/database.js";
const { DataTypes } = Sequelize;

const Vendor = dbConnection.define(
  "vendor",
  {
    namaVendor: {
      type: DataTypes.STRING(30),
    },
    namaToko: {
      type: DataTypes.STRING(30),
    },
    alamatToko: {
      type: DataTypes.TEXT,
    },
    noWa: {
      type: DataTypes.STRING(15),
    },
    email: {
      type: DataTypes.STRING(20),
    },
    password: {
      type: DataTypes.STRING(20),
    },
    refreshToken: {
      type: DataTypes.TEXT,
    },
  },
  { freezeTableName: true }
);
export default Vendor;
