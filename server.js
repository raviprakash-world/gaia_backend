require("rootpath")();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");
const bodyParser = require("body-parser");
const path = require("path");
const cron = require("node-cron");
const mailConfig = require("mailServerConfig.json");
require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");

// const NotificationService = require("./Notification/notification.service");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// increase maximum request size limit
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use("/image", express.static("Transaction/Img/"));
app.use("/file", express.static("Transaction/IndemnityForm/"));
app.use("/billImage", express.static("BillRepository/Img/"));

// serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, "dist")));

// Create a custom token to log the request body
morgan.token("body", (req) => {
  const requestBody = { ...req.body };

  if (
    req.method === "POST" &&
    req.url === "/transaction/create"
    // requestBody.TrapImg === "data:image/png;base64,"
  ) {
    delete requestBody.TrapImg;
  } else if (
    req.method === "PUT" &&
    req.url.includes("/transaction/update/")
    // requestBody.TrapImg === "data:image/png;base64,"
  ) {
    delete requestBody.ReleaseImg;
  }

  return JSON.stringify(requestBody);
});

app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body",
    { immediate: true }
  )
);

// api routes
app.use("/login", require("./auth/auth.controller"));
app.use("/role", require("./roleTable/role.controller"));
app.use("/category", require("./Category/Category.controller"));
app.use("/fregnance", require("./FregnanceFamily/Fregnance.controller"));
app.use("/brand", require("./Brand/Brand.controller"));
app.use("/products", require("./Products/Products.controller"));

app.use("/color", require("./Color/Color.controller"));

// fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

// global error handler
app.use(errorHandler);

// cron.schedule(process.env.CRON_SCHEDULE, () => {
//   console.log("Running the transaction check cron job...");
//   (async function () {
//     try {
//       await transactionsCheck();
//       console.log("Transaction check complete");
//     } catch (e) {
//       console.error("Transaction check error: ", e);
//     }
//   })();
// });

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4110;
app.listen(port, () => console.log("Server listening on port " + port));
