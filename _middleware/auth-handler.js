const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = authHandler;

function authHandler(action, resource) {
  return async function (req, res, next) {
    try {
      const params = req.headers;
      //   get the token from the authorization header
      if (!params.authorization) {
        throw { message: "Invalid authorization.Please provide token" };
      }
      const token = params.authorization.split(" ")[1];

      //check if the token matches the supposed origin
      const decodedToken = jwt.verify(token, process.env.CODED_TOKEN);

      // retrieve the user details of the logged in user
      const user = decodedToken;

      //Authentication
      await db.Authentication.findOne({
        where: { username: user.username },
      });

      //Authorization

      const roles = await require("_helpers/role")(db);
      // console.log(roles);
      const permission = roles.can(user.role)[action](resource);
      if (!permission.granted) {
        // return res.status(401).json({
        //   error: "You don't have enough permission to perform this action",
        // });
        throw {
          message: "You don't have enough permission to perform this action",
        };
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
