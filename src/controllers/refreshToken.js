import Vendor from "../models/vendorModels.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const vendor = await Vendor.findAll({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!vendor[0]) res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.sendStatus(403);
        const payload = {
          id: vendor[0].id,
          namaVendor: vendor[0].namaVendor,
          namaToko: vendor[0].namaToko,
          alamatToko: vendor[0].alamatToko,
          noWa: vendor[0].noWa,
          email: vendor[0].email,
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15s",
        });
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error(error);
  }
};
