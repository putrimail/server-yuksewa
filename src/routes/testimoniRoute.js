import express from "express";
import { getTestimoni, testimoni } from "../controllers/testimoniControl.js";
const testimoniRoute = express.Router();

testimoniRoute.post("/testimoni", testimoni);
testimoniRoute.get("/testimoni", getTestimoni);

export default testimoniRoute;
