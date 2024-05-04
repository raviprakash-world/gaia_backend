const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const fileUploadCheck = require("_middleware/file-upload-check");
const fregnanceService = require("./Fregnance.service");
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
  fileUploadCheck.single("image_url"),
  create
);

router.put(
  "/update/:id",
  // authHandler("updateAny", "authResource"),
  fileUploadCheck.single("image_url"),
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
  fregnanceService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function create(req, res, next) {
  fregnanceService
    .create(req)
    .then((data) => res.json({ message: "fregnance created", data: data }))
    .catch(next);
}

function update(req, res, next) {
  fregnanceService
    .update(req.params.id, req)
    .then((data) =>
      res.json({
        message: "fregnance updated",
        data: data,
      })
    )
    .catch(next);
}

function _delete(req, res, next) {
  fregnanceService
    .delete(req.params.id)
    .then(() => res.json({ message: "fregnance successfully deleted" }))
    .catch(next);
}

// schema functions

function createSchema(req, res, next) {
  const fregnance = Joi.object({});

  validateRequest(req, next, fregnance);
}

function updateSchema(req, res, next) {
  const fregnance = Joi.object({
    Fregnance_name: Joi.string().required(),
    image_url: Joi.string().required(),
  });
  validateRequest(req, next, fregnance);
}
