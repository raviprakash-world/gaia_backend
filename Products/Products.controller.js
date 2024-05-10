const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const fileUploadCheck = require("_middleware/file-upload-check");
const productsService = require("./Products.service");
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
  fileUploadCheck.single("main_image"),
  create
);

router.put(
  "/update/:id",
  // authHandler("updateAny", "authResource"),
  fileUploadCheck.single("main_image"),
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
  productsService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function create(req, res, next) {
  productsService
    .create(req)
    .then((data) => res.json({ message: "products created", data: data }))
    .catch(next);
}

function update(req, res, next) {
  productsService
    .update(req.params.id, req)
    .then((data) =>
      res.json({
        message: "products updated",
        data: data,
      })
    )
    .catch(next);
}

function _delete(req, res, next) {
  productsService
    .delete(req.params.id)
    .then(() => res.json({ message: "products successfully deleted" }))
    .catch(next);
}
