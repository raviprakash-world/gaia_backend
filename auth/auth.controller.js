const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authService = require("./auth.service");
const authHandler = require("../_middleware/auth-handler");

// routes

router.get("/", authUser);
router.get("/getall", authHandler("readAny", "authResource"), getAll);
router.post("/", loginUserSchema, loginUser);
router.post(
  "/create",
  // authHandler("createAny", "authResource"),
  UserSchema,
  createUser
);
router.put(
  "/setpassword/:id",
  authHandler("updateOwn", "authResource"),
  passwordSchema,
  updateUser
);
router.put(
  "/update/:id",
  authHandler("updateAny", "authResource"),
  updateSchema,
  update
);
router.delete("/:id", authHandler("deleteAny", "authResource"), _delete);

module.exports = router;

// route functions

function authUser(req, res, next) {
  authService
    .authUser(req.headers)
    .then((data) => res.json({ data }))
    .catch(next);
}

function getAll(req, res, next) {
  authService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function loginUser(req, res, next) {
  authService
    .loginUser(req.body)
    .then((data) => res.json({ data }))
    .catch(next);
}

function createUser(req, res, next) {
  authService
    .createUser(req.body)
    .then((data) => res.json({ message: "user created" }))
    .catch(next);
}
function updateUser(req, res, next) {
  authService
    .updateUser(req.params.id, req.body)
    .then((data) =>
      res.json({
        message: "password updated",
      })
    )
    .catch(next);
}

function update(req, res, next) {
  authService
    .update(req.params.id, req.body)
    .then((data) =>
      res.json({
        message: "user updated",
      })
    )
    .catch(next);
}

function _delete(req, res, next) {
  authService
    .delete(req.params.id)
    .then(() => res.json({ message: "user successfully deleted" }))
    .catch(next);
}

// schema functions

function loginUserSchema(req, res, next) {
  const schema = Joi.object({
    contact: Joi.alternatives().try(
      Joi.string().email().required(),
      Joi.string().pattern(new RegExp("^[0-9]{10,15}$")).required()
    ),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, next, schema);
}
function UserSchema(req, res, next) {
  const userschema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).max(20).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(new RegExp("^[0-9]{10,15}$")).required(),
    role: Joi.array().items(Joi.string()).required(),
    isAdmin: Joi.boolean().required(),
  });
  validateRequest(req, next, userschema);
}
function passwordSchema(req, res, next) {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const userschema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.array().items(Joi.string()).required(),
  });
  validateRequest(req, next, userschema);
}
