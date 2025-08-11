const express = require("express");
// Import the Express framework

const app = express();
// Create an instance of an Express application

const PORT = 3000;
// Define the port number where the server will listen

// Example route returning HTML (commented out)
// app.get("/", (req, res) => {
//   res.status(200).send("<h1>Get request success</h1>");
// });

app.get("/", (req, res) => {
  // Define a GET route for the root URL "/"
  res.status(200).json({ message: "Success", status: 200 });
  // Send a JSON response with status code 200
});

app.listen(PORT, () => {
  // Start the server and listen on the specified PORT
  console.log(`Backend Server is running on PORT = ${PORT}....`);
  // Log a message to confirm server is running
});
