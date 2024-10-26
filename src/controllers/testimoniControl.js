import Testimoni from "../models/testimoni.js";

export const testimoni = async (req, res) => {
  try {
    const { email, pesan } = req.body;
    await Testimoni.create({
      email: email,
      pesan: pesan,
    });
    res.status(200).json({ msg: "permintaan berhasil" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getTestimoni = async (req, res) => {
  try {
    const responseData = await Testimoni.findAll();
    res.status(200).json({ status: "ok", data: responseData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
