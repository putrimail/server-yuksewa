import Product from "../models/productModels.js";
import path from "path";
import fs from "fs";
import Kategori from "../models/kategori.js";
import Vendor from "../models/vendorModels.js";
export const getAllProduct = async (req, res) => {
  try {
    const result = await Product.findAll();
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ msg: "internal service error", error });
  }
};

export const getProductByVendorId = async (req, res) => {
  try {
    const result = await Product.findAll({
      where: {
        vendorId: req.params.vendorId,
      },
      include: [
        {
          model: Vendor,
          attributes: ["alamatToko", "noWa", "namaToko"],
        },
      ],
    });
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ msg: "internal service error", error });
  }
};
export const getProductById = async (req, res) => {
  try {
    const result = await Product.findAll({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    res.status(500).json({ msg: "internal service error", error });
  }
};
export const getProductByKategori = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        kategori: req.params.kategori,
      },
      include: [
        {
          model: Vendor,
          attributes: ["alamatToko", "noWa", "namaToko"],
        },
      ],
    });
    res.status(200).json({ status: "ok", data: products });
  } catch (error) {
    res.status(500).json({ msg: "internal service error", error });
  }
};

export const saveProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No file uploaded" });

  const { vendorId, namaBarang, harga, deskripsi, kategori } = req.body;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.md5}${ext}`;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "File must be a png, jpg, or jpeg" });
  if (fileSize > 10000000)
    return res.status(422).json({ msg: "File size exceeds 10MB" });

  try {
    // Save the file
    await file.mv(`./public/images/${fileName}`);

    // Create the product record
    await Product.create({
      vendorId: vendorId,
      namaBarang: namaBarang,
      harga: harga,
      deskripsi: deskripsi,
      url: url,
      imageName: fileName,
      kategori: kategori,
    });

    res.status(201).json({ msg: "Product created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // Cari produk berdasarkan vendorId
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Data tidak tersedia" });

    let fileName = product.imageName; // Default to existing image name
    if (req.files !== null) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase()))
        return res
          .status(422)
          .json({ msg: "File harus berupa png, jpg, atau jpeg" });
      if (fileSize > 10000000)
        return res.status(422).json({ msg: "Ukuran gambar melebihi 10MB" });

      // Hapus file lama
      const filePath = `./public/images/${product.imageName}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Pindahkan file baru
      await file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }

    // Perbarui detail produk di database
    await Product.update(
      {
        vendorId: req.body.vendorId,
        namaBarang: req.body.namaBarang,
        harga: req.body.harga,
        deskripsi: req.body.deskripsi,
        url: `${req.protocol}://${req.get("host")}/images/${fileName}`,
        imageName: fileName,
        kategori: req.body.kategori,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "Product updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ msg: "Product not found" });

  try {
    // Check if the file exists and delete it
    const filePath = `./public/images/${product.imageName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the product
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const kategori = async (req, res) => {
  try {
    const result = await Kategori.findAll();
    res.status(200).json({ msg: "ok", data: result });
  } catch (error) {
    res.status(500).json({ msg: "Internal service error" });
  }
};

export const getProductsWithVendorInfo = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Vendor,
          attributes: ["alamatToko", "noWa", "namaToko"],
        },
      ],
    });

    res.status(200).json({ status: "ok", data: products });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error", error });
  }
};
