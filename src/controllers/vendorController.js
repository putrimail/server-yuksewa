import Vendor from "../models/vendorModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getVendors = async (req, res) => {
  try {
    const vendor = await Vendor.findAll({
      attributes: [
        "id",
        "namaVendor",
        "namaToko",
        "alamatToko",
        "noWa",
        "email",
      ],
    });
    if (vendor.length <= 0)
      return res.status(400).json({ msg: "data tidak tersedia" });
    res.status(200).json({
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({ msg: "internal service error", error });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({ msg: "internal service error", error });
  }
};
export const register = async (req, res) => {
  const { namaVendor, namaToko, alamatToko, noWa, email, password } = req.body;

  try {
    if (
      !namaVendor ||
      !namaToko ||
      !alamatToko ||
      !noWa ||
      !email ||
      !password
    ) {
      return res.status(400).json({ msg: "form tidak boleh kosong" });
    }
    const accountAlready = await Vendor.findOne({ where: { email: email } });
    if (accountAlready) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const prefixWa = noWa.startsWith("08") ? "628" + noWa.slice(2) : noWa;
    const result = await Vendor.create({
      namaVendor,
      namaToko,
      alamatToko,
      noWa: prefixWa,
      email,
      password: hashPassword,
    });

    res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal service error", error });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const dataVendor = await Vendor.findOne({
      where: {
        email: email,
      },
    });
    if (!dataVendor) {
      return res.status(400).json({ msg: "akun tidak tersedia" });
    }

    const matchPassword = await bcrypt.compare(password, dataVendor.password);
    if (!matchPassword) {
      return res.status(401).json({ msg: "akun anda tidak cocok" });
    }

    const payload = {
      id: dataVendor.id,
      namaVendor: dataVendor.namaVendor,
      namaToko: dataVendor.namaToko,
      alamatToko: dataVendor.alamatToko,
      noWa: dataVendor.noWa,
      email: dataVendor.email,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await Vendor.update(
      { refreshToken: refreshToken },
      {
        where: {
          id: dataVendor.id,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    res.status(200).json({ status: "ok", accessToken: accessToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "internal service error", error });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const vendor = await Vendor.findAll({
    where: {
      refreshToken: refreshToken,
    },
  });
  if (!vendor[0]) res.sendStatus(204);
  const vendorId = vendor[0].id;
  await Vendor.update(
    { refreshToken: null },
    {
      where: {
        id: vendorId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

export const updateVendorById = async (req, res) => {
  try {
    const { namaVendor, namaToko, alamatToko, noWa, email } = req.body;
    const vendor = await Vendor.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!vendor)
      return res.status(404).json({ msg: "tidak dapat melakukan perubahan" });

    await Vendor.update(
      {
        namaVendor: namaVendor,
        namaToko: namaToko,
        alamatToko: alamatToko,
        noWa: noWa,
        email: email,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "profile updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "internal service error", error });
  }
};

export const ubahPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirm } = req.body;

    const cekPassword = await Vendor.findOne({
      where: {
        id: req.params.id,
      },
    });
    const match = await bcrypt.compare(oldPassword, cekPassword.password);
    if (!match)
      return res.status(404).json({ msg: "password lama anda salah" });

    if (newPassword !== confirm)
      return res.status(400).json({ msg: "password tidak sesuai" });
    if (newPassword.length < 8)
      return res.status(400).json({ msg: "password harus 8 karakter" });
    if (newPassword === oldPassword)
      return res.status(400).json({ msg: "gunakan password baru" });
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await Vendor.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "ubah password berhasil" });
  } catch (error) {
    res.status(500).json({ msg: "internal service error", error });
  }
};
