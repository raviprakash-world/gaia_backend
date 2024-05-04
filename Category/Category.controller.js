const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const categoryService = require("./Category.service");
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
  categoryService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function create(req, res, next) {
  categoryService
    .create(req.body)
    .then((data) => res.json({ message: "category created" }))
    .catch(next);
}

function update(req, res, next) {
  categoryService
    .update(req.params.id, req.body)
    .then((data) =>
      res.json({
        message: "category updated",
      })
    )
    .catch(next);
}

function _delete(req, res, next) {
  categoryService
    .delete(req.params.id)
    .then(() => res.json({ message: "category successfully deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const category = Joi.object({
    categoryName: Joi.string().required(),
    gender: Joi.string().required(),
  });
  validateRequest(req, next, category);
}

function updateSchema(req, res, next) {
  const category = Joi.object({
    categoryName: Joi.string().required(),
    gender: Joi.string().required(),
  });
  validateRequest(req, next, category);
}
