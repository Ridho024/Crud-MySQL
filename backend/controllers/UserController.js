import User from "../models/UserModel.js";
import path from "path";
import fs from "fs";

// Pagination
import { Op } from "sequelize";

export const getUsers = async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await User.count({
    where: {
      [Op.or]: [{ name: { [Op.like]: "%" + search + "%" } }, { email: { [Op.like]: "%" + search + "%" } }],
    },
  });

  const totalPage = Math.ceil(totalRows / limit); // Menghitung total page total rows dibagi dengan limitnya ... masuk akal

  try {
    const response = await User.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: "%" + search + "%" } }, { email: { [Op.like]: "%" + search + "%" } }],
      },
      offset: offset,
      limit: limit,
      order: [
        ["id", "DESC"], // Biar yang terbaru yang muncul pertama
      ],
    });

    res.status(200).json({
      result: response,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage,
    });
    
  } catch (error) {
    console.error(error.message);
  }
};

export const getUserByID = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
  }
};

export const createUser = async (req, res) => {
  // Check if any files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  // if (req.files === null) return res.status(400).json({ msg: "No file uploaded" });
  const name = req.body.name;
  const email = req.body.email;
  const gender = req.body.gender;
  const file = req.files.file;

  // Check if file exists
  if (!file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 mb" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    try {
      await User.create({ name: name, email: email, gender: gender, image: fileName, url: url });
      res.status(201).json({ msg: "User Created Successfukky" });
    } catch (error) {
      console.error(error.message);
    }
  });
};

export const editUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) return res.status(404).json({ msg: "No data found" });
  let fileName = "";

  if (req.files === null) {
    fileName = user.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 mb" });

    const filePath = `./public/images/${user.image}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const name = req.body.name;
  const email = req.body.email;
  const gender = req.body.gender;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await User.update(
      { name: name, image: fileName, url: url, email: email, gender: gender },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({ msg: "User Updated Successfully" });
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) return res.status(404).json({ msg: "No data found" });

  try {
    const filePath = `./public/images/${user.image}`;
    console.log(filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Image Deleted");
    } else {
      console.log("Image not found, skipping deletion");
    }

    await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (error) {
    console.error(error.message);
  }
};
