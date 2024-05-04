const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const jwt = require("jsonwebtoken");
const { response } = require("express");
require("dotenv").config();

async function getAll() {
  const getAllCategory = await db.Category.findAll();
  // getAllUser.forEach((user) => {
  //   user.role = user.role.split(",");
  // });
  return getAllCategory;
}

async function create(params) {
  function generateId() {
    const prefix = params.categoryName.substring(0, 1).toUpperCase();
    let suffix;
    switch (params.gender) {
      case "male":
        suffix = "001";
        break;
      case "female":
        suffix = "002";
        break;
      default:
        suffix = "000";
    }
    return `${prefix}${suffix}`;
  }
  const id = generateId();
  const category = new db.Category({ id, ...params });

  await category.save();
}

async function update(id, params) {
  const category = await db.Category.findByPk(id);
  if (!category) {
    throw { message: " category not found" };
  }
  // params.role = params.role.join(",");
  Object.assign(category, params);
  await category.save();
  return category;
}

async function _delete(id) {
  const category = await db.Category.findByPk(id);
  if (!category) {
    throw { message: " user not found" };
  }
  await user.destroy();
}

module.exports = {
  getAll,
  create,
  update,
  delete: _delete,
};
