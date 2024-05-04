const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const jwt = require("jsonwebtoken");
const { response } = require("express");
require("dotenv").config();

async function getAll() {
  const getAllColor = await db.Color.findAll();
  // getAllUser.forEach((user) => {
  //   user.role = user.role.split(",");
  // });
  return getAllColor;
}

async function create(params) {
  const color = new db.Color({
    ...params,
  });

  await color.save();
}

async function update(id, params) {
  const color = await db.Color.findByPk(id);
  if (!color) {
    throw { message: " Color not found" };
  }
  // params.role = params.role.join(",");
  Object.assign(color, params);
  await color.save();
  return color;
}

async function _delete(id) {
  const color = await db.Color.findByPk(id);
  if (!color) {
    throw { message: " Color not found" };
  }
  await color.destroy();
}

module.exports = {
  getAll,
  create,
  update,
  delete: _delete,
};
