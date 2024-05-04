const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const { Op } = require("sequelize");
require("dotenv").config();

async function authUser(pramas) {
  try {
    //   get the token from the authorization header
    const token = pramas.authorization.split(" ")[1];

    //check if the token matches the supposed origin
    console.log("process.env.CODED_TOKEN", process.env.CODED_TOKEN);
    const decodedToken = jwt.verify(token, process.env.CODED_TOKEN);
    // retrieve the user details of the logged in user
    const user = decodedToken;

    const auth = await db.Authentication.findOne({
      where: { username: user.username },
    });

    console.log("auth", auth);

    return auth;
  } catch (error) {
    throw "Authorization Failed";
  }
}

async function getAll() {
  const getAllUser = await db.Authentication.findAll();
  getAllUser.forEach((user) => {
    user.role = user.role.split(",");
  });
  return getAllUser;
}

async function loginUser(params) {
  //validate user exists
  const auth = await db.Authentication.scope("withHash").findOne({
    where: {
      [Op.or]: [{ email: params.contact }, { phoneNumber: params.contact }],
    },
  });
  if (!auth) {
    throw "user doesn’t exist";
  }
  if (auth.expiry === true) {
    throw "password expired";
  }

  //validate password
  if (!(await bcrypt.compare(params.password, auth.passwordHash))) {
    throw "Incorrect Password";
  }

  //generate token
  const token = jwt.sign(
    {
      id: auth.id,
      username: auth.username,
      email: auth.email,
      role: auth.role.split(","),
    },
    //CODED_TOKEN pass as run parameter or define in .env file
    process.env.CODED_TOKEN,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );

  return {
    token,
    role: auth.role.split(","),
  };
}

async function createUser(params) {
  if (
    await db.Authentication.findOne({
      where: { email: params.email },
    })
  ) {
    throw { message: " email already exist" };
  }
  if (
    await db.Authentication.findOne({
      where: { phoneNumber: params.phoneNumber },
    })
  ) {
    throw { message: "phoneNumber already exist" };
  }
  const auth = new db.Authentication({
    expiry: false,
    ...params,
  });
  //
  // hash password
  auth.passwordHash = await bcrypt.hash(params.password, 10);

  auth.role = params.role.join(",");
  // save user
  await auth.save();
}
async function updateUser(id, params) {
  const user = await db.Authentication.findByPk(id);
  if (!user) {
    throw { message: " user not found" };
  }
  params.passwordHash = await bcrypt.hash(params.password, 10);

  Object.assign(user, params);
  await user.save();
  return user;
}

async function update(id, params) {
  const user = await db.Authentication.findByPk(id);
  if (!user) {
    throw { message: " user not found" };
  }
  params.role = params.role.join(",");
  Object.assign(user, params);
  await user.save();
  return user;
}

async function _delete(id) {
  const user = await db.Authentication.findByPk(id);
  if (!user) {
    throw { message: " user not found" };
  }
  await user.destroy();
}

module.exports = {
  authUser,
  getAll,
  loginUser,
  createUser,
  updateUser,
  update,
  delete: _delete,
};
