import express from "express";
import {
  deleteProduct,
  getAllProduct,
  getProductById,
  getProductByKategori,
  getProductByVendorId,
  getProductsWithVendorInfo,
  kategori,
  saveProduct,
  updateProduct,
} from "../controllers/productController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const productRoute = express.Router();

productRoute.get("/product", verifyToken, getAllProduct);
productRoute.get("/productvendor", getProductsWithVendorInfo);
productRoute.get("/product/:vendorId", verifyToken, getProductByVendorId);
productRoute.get("/product/vendor/:id", getProductById);
productRoute.get("/productvendor/:kategori", getProductByKategori);
productRoute.get("/kategori", kategori);
productRoute.post("/product", saveProduct);
productRoute.patch("/product/:id", updateProduct);
productRoute.delete("/product/:id", deleteProduct);

export default productRoute;
