const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const jwt = require("jsonwebtoken");
const { response } = require("express");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fileUploadCheck = require("_middleware/file-upload-check");
const { log } = require("console");
const { DATE, QueryTypes } = require("sequelize");

async function getAll() {
  const products = await db.sequelize.query(
    `SELECT p.*, b.*, f.*
    FROM Products p
    JOIN brands b ON p.brand_id = b.brand_id
    JOIN fregnances f ON p.Fregnance_id = f.Fregnance_id`,
    {
      type: QueryTypes.SELECT,
    }
  );

  return products;
}

async function create(req) {
  if (req.fileValidationError) {
    throw new Error(req.fileValidationError);
  }
  const {
    product_name,
    brand_id,
    Fregnance_id,
    description,
    gender,
    size,
    price,
    discount_price,
    stock_quantity,
    image_id,
  } = req.body;

  if (
    !product_name ||
    !brand_id ||
    !Fregnance_id ||
    !description ||
    !gender ||
    !size ||
    !price ||
    !discount_price ||
    !stock_quantity
  ) {
    throw { message: "Missing required fields", statusCode: 404 };
  }
  const main_image = req.file ? req.file.filename : "";
  if (!main_image) {
    throw { message: "Missing required main image", statusCode: 404 };
  }
  const product = await db.Products.create({
    product_name,
    brand_id,
    Fregnance_id,
    description,
    gender,
    size,
    price,
    discount_price,
    stock_quantity,
    main_image,
  });

  return {
    product_name,
    brand_id,
    Fregnance_id,
    description,
    gender,
    size,
    price,
    discount_price,
    stock_quantity,
    image_id,
  };
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
