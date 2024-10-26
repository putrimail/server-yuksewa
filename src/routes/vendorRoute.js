import express from "express";
import {
  getVendorById,
  getVendors,
  login,
  logout,
  register,
  ubahPassword,
  updateVendorById,
} from "../controllers/vendorController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/refreshToken.js";
const vendorRoute = express.Router();

vendorRoute.get("/getvendor", verifyToken, getVendors);
vendorRoute.get("/getvendor/:id", verifyToken, getVendorById);
vendorRoute.post("/register", register);
vendorRoute.post("/login", login);
vendorRoute.get("/token", refreshToken);
vendorRoute.delete("/logout", logout);
vendorRoute.patch("/editVendor/:id", updateVendorById);
vendorRoute.patch("/gantipassword/:id", ubahPassword);

export default vendorRoute;
