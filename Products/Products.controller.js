const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const fileUploadCheck = require("_middleware/file-upload-check");
const brandService = require("./Brand.service");
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
  fileUploadCheck.single("brand_logo_url"),
  create
);

router.put(
  "/update/:id",
  // authHandler("updateAny", "authResource"),
  fileUploadCheck.single("brand_logo_url"),
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
  brandService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function create(req, res, next) {
  brandService
    .create(req)
    .then((data) => res.json({ message: "brand created", data: data }))
    .catch(next);
}

function update(req, res, next) {
  brandService
    .update(req.params.id, req)
    .then((data) =>
      res.json({
        message: "brand updated",
        data: data,
      })
    )
    .catch(next);
}

function _delete(req, res, next) {
  brandService
    .delete(req.params.id)
    .then(() => res.json({ message: "brand successfully deleted" }))
    .catch(next);
}
