module.exports = validateRequest;

function validateRequest(req, next, schema) {
  // console.log("validation :", req.body);
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: false, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    console.log(error.details.map((x) => x.message).join(", "));
    next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
  }
  next();
}
