const express = require("express"); // Import the Express framework
const moment = require("moment-timezone");
const morgan = require("morgan");
const authRouter = require("./Routes/authRouter.js");
const usersRouter = require("./Routes/usersRoutes");
// const sanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");

const app = express(); // Create an Express application instance

const moviesRouter = require("./Routes/moviesRoutes.js");

function ownMiddleware(req, res, next) {
  console.log("Own Middleware is called..");
  next();
}

app.use(express.json());
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
app.use((req, res, next) => {
  res.status(404).json({
    status: "Fail",
    message: `Can't find ${req.originalUrl} not found on the server `,
  });
});
module.exports = app;
