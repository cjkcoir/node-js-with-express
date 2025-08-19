const express = require("express"); // Import the Express framework

const app = require("./app"); // Create an Express application instance

const PORT = 3000; // Define the port number for the server

app.listen(PORT, () => {
  // Start the server and listen for requests on the specified PORT
  console.log(`Backend Server is running on PORT = ${PORT}....`);
  // Log a message to confirm the server is running
});
