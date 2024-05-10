module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  console.log(typeof err);
  switch (true) {
    case typeof err === "string":
      console.log("error handler", err);
      // custom application error
      const is404 = err.toLowerCase().endsWith("not found");
      const is401 = err === "Authorization Failed";
      const is409 = err.toLowerCase().includes("far from trap location");

      let statusCode = is404 ? 404 : 400;
      statusCode = is401 ? 401 : statusCode;
      statusCode = is409 ? 409 : statusCode;
      return res
        .status(statusCode)
        .json({ message: err, code: res.statusCode });
    default:
      return res
        .status(500)
        .json({ message: err.message, role: err.role, code: err.statusCode });
  }
}
