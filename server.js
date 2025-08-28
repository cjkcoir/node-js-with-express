const express = require("express"); // Import the Express framework
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = require("./app"); // Create an Express application instance

const PORT = process.env.PORT || 3000; // Define the port number for the server

// console.log(app.get("env"));
console.log(process.env);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then((conn) => {
    // console.log(conn);
    console.log("DB COnnection Successful");
  })
  .catch((error) => {
    console.log(error);
  });

// const testMovie = new Movie({
//   name: "DieHard-1",
//   description: "Action Packed Movie ",
//   duration: 150,
//   ratings: 5.0,
// });

// testMovie
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err));

app.listen(PORT, () => {
  // Start the server and listen for requests on the specified PORT
  console.log(`Backend Server is running on PORT = ${PORT}....`);
  // Log a message to confirm the server is running
});
