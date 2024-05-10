const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const jwt = require("jsonwebtoken");
const { response } = require("express");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fileUploadCheck = require("_middleware/file-upload-check");
const { log } = require("console");

async function getAll() {
  const getAllBrand = await db.Brand.findAll();
  // getAllUser.forEach((user) => {
  //   user.role = user.role.split(",");
  // });
  return getAllBrand;
}

async function create(req) {
  console.log("req", req.body);
  console.log("req.file", req.file);
  if (req.fileValidationError) {
    throw new Error(req.fileValidationError);
  }
  const { brand_name, country, description, website } = req.body;
  const logo = req.file ? req.file.filename : null;
  console.log("logo", logo);
  const newBrand = await db.Brand.create({
    brand_name,
    country,
    description,
    logo,
    website,
  });

  return newBrand;
}

async function update(id, req) {
  console.log("req.body", req.body);
  console.log("req.file", req.file);
  console.log("id", id);

  if (!id) {
    throw new Error("Brand ID is required!");
  }

  const brand = await db.Brand.findByPk(id);
  if (!brand) {
    throw new Error("Brand not found!");
  }

  if (req.file) {
    const file = req.file;
    brand.image_url = file.filename; // Update the image URL if a new file is uploaded
  }

  if (req.body.brand_name) {
    brand.Brand_name = req.body.brand_name; // Update the name if provided
  }

  await brand.save();

  console.log("Updated Brand:", brand);

  return brand;
}

async function _delete(id) {
  const brand = await db.Brand.findByPk(id);
  if (!brand) {
    throw { message: " Brand not found" };
  }
  await brand.destroy();
}

module.exports = {
  getAll,
  create,
  update,
  delete: _delete,
};
