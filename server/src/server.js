const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.set("port", process.env.port || 4005);
fs = require("fs");
var https = require("https");
var bodyParser = require("body-parser");

//middleware

// app.use(cors());
app.use(cors({}));
app.use(bodyParser.json());
app.use(express.json());

//routes
app.use("/api/authentication", require("./routes/jwtAuth.http"));
app.use("/api/invoice", require("./routes/invoices.http"));

function validationErrorMiddleware(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const isValidationError = error instanceof ValidationError;
  if (!isValidationError) {
    return next(error);
  }

  response.status(400).json({
    errors: error.validationErrors,
  });

  next();
}

app.use(validationErrorMiddleware);

if (process.env.NODE_ENV === "local") {
  var httpsOptions = {
    key: fs.readFileSync("src/privkey.pem"),
    cert: fs.readFileSync("src/cert.pem"),
  };

  const server = https
    .createServer(httpsOptions, app)
    .listen(process.env.PORT, process.env.HOST_NAME, function () {
      console.log(`Listening at ${process.env.HOST_NAME}:${process.env.PORT}`);
    });
} else {
  app.listen(
    process.env.PORT,
    process.env.IP_ADDRESS,
    function (err, response) {
      console.log(`Listening at ${process.env.IP_ADDRESS}:${process.env.PORT}`);
    }
  );
}
