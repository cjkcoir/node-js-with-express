const express = require("express"); // Import the Express framework
const moment = require("moment-timezone");
const morgan = require("morgan");

const app = express(); // Create an Express application instance

const moviesRouter = require("./Routes/moviesRoutes.js");

function ownMiddleware(req, res, next) {
  console.log("Own Middleware is called..");
  next();
}

app.use(express.json());
app.use(morgan("dev"));
app.use(ownMiddleware);
app.use((req, res, next) => {
  req.requestedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  next();
});

app.use("/api/v1/movies", moviesRouter);
module.exports = app;
