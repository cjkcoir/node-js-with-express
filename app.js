const express = require("express"); // Import the Express framework
const moment = require("moment-timezone");

const fs = require("fs"); // Import the built-in File System module
const app = express(); // Create an Express application instance

const PORT = 3000; // Define the port number for the server

const movies = JSON.parse(fs.readFileSync("./data/movies.json"));
// Read the movies.json file synchronously and parse its JSON content into a JS object

function ownMiddleware(req, res, next) {
  console.log("Own Middleware is called..");
  next();
}

app.use(express.json());
app.use(ownMiddleware);
app.use((req, res, next) => {
  req.requestedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  next();
});

//127.0.0.1:3000/api/v1/movies --GET
http: app.get("/api/v1/movies", (req, res) => {
  // Define a GET route at /api/v1/movies
  res.status(200).json({
    // Send an HTTP 200 (OK) response in JSON format --METHOD CHAINING
    message: "Success", // Include a success message
    requestedAt: req.requestedAt,
    noOfMovies: movies.length,
    data: {
      // Wrap movie data inside a "data" object --ENVELOPING
      movies: movies, // Send the movies list from the file
    },
  });
});

// http://127.0.0.1:3000/api/v1/movies/6--GET
app.get("/api/v1/movies/:id", (req, res) => {
  const id = req.params.id * 1;
  let movie = movies.find((element) => element.id === id);

  if (!movie) {
    res.status(400).json({
      status: "Failed",
      message: `Movie with id = ${id} is not in the Database`,
    });
  }
  res.status(200).json({
    // Send an HTTP 200 (OK) response in JSON format --METHOD CHAINING
    message: "Success", // Include a success message
    requestedAt: req.requestedAt,
    data: {
      // Wrap movie data inside a "data" object --ENVELOPING
      movie: movie, // Send the movies list from the file
    },
  });
});

// http://127.0.0.1:3000/api/v1/movies---POST
app.post("/api/v1/movies", (req, res) => {
  console.log(req.body);
  const newId = movies[movies.length - 1].id + 1;
  const newMovie = Object.assign({ id: newId }, req.body);
  movies.push(newMovie);
  fs.writeFile("./data/movies.json", JSON.stringify(movies), () => {
    res.status(201).json({
      status: "Success",
      requestedAt: req.requestedAt,
      message: "Movie created",
      data: {
        movie: newMovie,
      },
    });
  });
});

app.listen(PORT, () => {
  // Start the server and listen for requests on the specified PORT
  console.log(`Backend Server is running on PORT = ${PORT}....`);
  // Log a message to confirm the server is running
});
