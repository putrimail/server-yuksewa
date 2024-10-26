import dbConnection from "../config/database.js";
import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const Kategori = dbConnection.define(
  "kategori",
  {
    kategori: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

export default Kategori;
