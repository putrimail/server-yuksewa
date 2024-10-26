import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/config/database.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import FileUpload from "express-fileupload";
import vendorRoute from "./src/routes/vendorRoute.js";
import productRoute from "./src/routes/productRoute.js";
dotenv.config();
const app = express();
const port = 5000;

try {
  await dbConnection.authenticate();
} catch (error) {
  console.error(error);
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(FileUpload());
app.use(express.static("public"));
app.use(vendorRoute);
app.use(productRoute);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", data: "server is runnig" });
});
app.listen(port, () => {
  console.log(`server runnig at http://localhost:${port}`);
});
