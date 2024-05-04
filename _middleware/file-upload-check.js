const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer middleware
const fileUploadCheck = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
}); // Change to single instead of array for one file upload

module.exports = fileUploadCheck;
