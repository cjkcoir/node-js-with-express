const express = require("express"); // Import the Express framework

const fs = require("fs"); // Import the built-in File System module
const app = express(); // Create an Express application instance

const PORT = 3000; // Define the port number for the server

const movies = JSON.parse(fs.readFileSync("./data/movies.json"));
// Read the movies.json file synchronously and parse its JSON content into a JS object

app.get("/api/v1/movies", (req, res) => {
  // Define a GET route at /api/v1/movies
  res.status(200).json({
    // Send an HTTP 200 (OK) response in JSON format --METHOD CHAINING
    message: "Success", // Include a success message
    noOfMovies: movies.length,
    data: {
      // Wrap movie data inside a "data" object --ENVELOPING
      movies: movies, // Send the movies list from the file
    },
  });
});

app.listen(PORT, () => {
  // Start the server and listen for requests on the specified PORT
  console.log(`Backend Server is running on PORT = ${PORT}....`);
  // Log a message to confirm the server is running
});
