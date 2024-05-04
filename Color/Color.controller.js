const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const ColorService = require("./Color.service");
const authHandler = require("../_middleware/auth-handler");

// routes

// router.get("/", authUser);
router.get(
  "/",
  // authHandler("readAny", "authResource"),
  getAll
);

router.post(
  "/create",
  // authHandler("createAny", "authResource"),
  createSchema,
  create
);

router.put(
  "/update/:id",
  // authHandler("updateAny", "authResource"),
  updateSchema,
  update
);
router.delete(
  "/:id",
  //  authHandler("deleteAny", "authResource"),
  _delete
);

module.exports = router;

// route functions

function getAll(req, res, next) {
  ColorService.getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function create(req, res, next) {
  ColorService.create(req.body)
    .then((data) => res.json({ message: "Color created" }))
    .catch(next);
}

function update(req, res, next) {
  ColorService.update(req.params.id, req.body)
    .then((data) =>
      res.json({
        message: "Color updated",
      })
    )
    .catch(next);
}

function _delete(req, res, next) {
  ColorService.delete(req.params.id)
    .then(() => res.json({ message: "Color successfully deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const Color = Joi.object({
    ColorName: Joi.string().required(),
    // ColorCode: Joi.string(),
  });
  validateRequest(req, next, Color);
}

function updateSchema(req, res, next) {
  const Color = Joi.object({
    ColorName: Joi.string().required(),
    // ColorCode: Joi.string(),
  });
  validateRequest(req, next, Color);
}
