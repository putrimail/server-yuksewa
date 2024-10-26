import dbConnection from "../config/database.js";
import { Sequelize } from "sequelize";
const { DataTypes } = Sequelize;

const Testimoni = dbConnection.define(
  "testimoni",
  {
    email: {
      type: DataTypes.STRING(50),
    },
    pesan: {
      type: DataTypes.STRING(50),
    },
  },
  {
    freezeTableName: true,
  }
);

export default Testimoni;
