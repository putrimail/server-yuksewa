import dbConnection from "../config/database.js";
import { Sequelize } from "sequelize";
import Vendor from "./vendorModels.js";
const { DataTypes } = Sequelize;

const Product = dbConnection.define(
  "product",
  {
    vendorId: {
      type: DataTypes.STRING,
    },
    namaBarang: {
      type: DataTypes.STRING,
    },
    harga: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.STRING,
    },
    imageName: {
      type: DataTypes.STRING,
    },
    kategori: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

Vendor.hasMany(Product, { foreignKey: "vendorId" });
Product.belongsTo(Vendor, { foreignKey: "vendorId" });

export default Product;
