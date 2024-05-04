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
  const getAllFregnance = await db.Fregnance.findAll();
  // getAllUser.forEach((user) => {
  //   user.role = user.role.split(",");
  // });
  return getAllFregnance;
}

async function create(req) {
  console.log("req", req.body);
  console.log("req.body.Fregnance_name", req.body.Fregnance_name);
  console.log("req.body.image_url", req.body.image_url);
  console.log("req.file", req.file);
  const files = [req.file];

  if (!files || files.length === 0) {
    throw new Error("No files selected!");
  }

  console.log(files);

  let filenames = files.map((file) => file.filename);
  const params = {
    Fregnance_name: req.body.Fregnance_name,
    image_url: filenames[0],
  };
  console.log(params);

  const fregnance = new db.Fregnance({ ...params });

  await fregnance.save();

  return fregnance;
}

async function update(id, req) {
  console.log("req.body", req.body);
  console.log("req.file", req.file);
  console.log("id", id);

  if (!id) {
    throw new Error("Fregnance ID is required!");
  }

  const fregnance = await db.Fregnance.findByPk(id);
  if (!fregnance) {
    throw new Error("Fregnance not found!");
  }

  if (req.file) {
    const file = req.file;
    fregnance.image_url = file.filename; // Update the image URL if a new file is uploaded
  }

  if (req.body.Fregnance_name) {
    fregnance.Fregnance_name = req.body.Fregnance_name; // Update the name if provided
  }

  await fregnance.save();

  console.log("Updated Fregnance:", fregnance);

  return fregnance;
}

async function _delete(id) {
  const fregnance = await db.Fregnance.findByPk(id);
  if (!fregnance) {
    throw { message: " Fregnance not found" };
  }
  await fregnance.destroy();
}

module.exports = {
  getAll,
  create,
  update,
  delete: _delete,
};
