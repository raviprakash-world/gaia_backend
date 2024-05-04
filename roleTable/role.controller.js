const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authHandler = require("../_middleware/auth-handler");
const roleService = require("./role.service");

// routes

router.get(
  "/",
  // authHandler("readAny", "authResource"),
  getAll
);
router.post(
  "/create",
  // authHandler("createAny", "authResource"),
  UserSchema,
  createUser
);
router.put(
  "/updaterole/:id",
  // authHandler("updateAny", "authResource"),
  updateSchema,
  update
);
router.delete(
  "/:id",
  // authHandler("deleteAny", "authResource"),
  _delete
);

module.exports = router;

// route functions

function getAll(req, res, next) {
  roleService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function createUser(req, res, next) {
  console.log("create user controller");
  roleService
    .create(req.body)
    .then((data) => res.json({ message: "role created" }))
    .catch(next);
}

function update(req, res, next) {
  roleService
    .update(req.params.id, req.body)
    .then((data) =>
      res.json({
        message: "role updated",
      })
    )
    .catch(next);
}

function _delete(req, res, next) {
  roleService
    .delete(req.params.id)
    .then(() => res.json({ message: "role successfully deleted" }))
    .catch(next);
}

// schema functions

function UserSchema(req, res, next) {
  const userschema = Joi.object({
    role: Joi.string().required(),
    roleResource: Joi.string().required(),
  });
  validateRequest(req, next, userschema);
}

function updateSchema(req, res, next) {
  const userschema = Joi.object({
    role: Joi.string().required(),
  });
  validateRequest(req, next, userschema);
}
