const express = require("express"); // Import the Express framework
const moment = require("moment-timezone");
const morgan = require("morgan");
const authRouter = require("./Routes/authRouter.js");
const usersRouter = require("./Routes/usersRoutes");
// const sanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const app = express(); // Create an Express application instance
app.use(helmet());

let limiter = rateLimit({
  max: 3,
  windowMs: 1 * 60 * 60 * 1000,
  message:
    "We have received too many requests from thi IP. Please try after One Hour.",
});

app.use("/api", limiter);

const moviesRouter = require("./Routes/moviesRoutes.js");

function ownMiddleware(req, res, next) {
  console.log("Own Middleware is called..");
  next();
}

app.use(express.json({ limit: "10kb" }));
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }
// app.use(sanitize());

// app.use(xss());
app.use(ownMiddleware);
app.use((req, res, next) => {
  req.requestedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  next();
});

// app.use(...) → Registers middleware with your Express app. Middleware is code that runs for every incoming request before it reaches your routes.

// express.static(...) → A built-in middleware function in Express that serves static files (like HTML, CSS, JS, images).

// "./public" → The folder path where your static files are stored. In this case, it tells Express to look in the public folder (relative to your project’s root).
app.use(express.static("./public"));

app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
// Middleware to handle undefined routes
app.use((req, res, next) => {
  // Send a JSON response with 404 status
  // res.status(404).json({
  //   status: "Fail", // Clearly mark request as failed
  //   message: `Can't find ${req.originalUrl} not found on the server `, // Tell client which URL failed
  // });
  const err = new Error(
    `Can't find ${req.originalUrl} not found on the server `
  );
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use((error, req, res, next) => {
  // Ensure the error object has a statusCode (default: 500 for server errors)
  error.statusCode = error.statusCode || 500;

  // Ensure the error object has a status (default: "error")
  error.status = error.status || "error";

  // Send the error response as JSON with proper HTTP status
  res.status(error.statusCode).json({
    status: error.statusCode, // The HTTP status code
    message: error.message, // The error description/message
  });
});

module.exports = app;
