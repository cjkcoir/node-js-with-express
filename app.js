const express = require("express");

const app = express();

const PORT = 3000;

// app.get("/", (req, res) => {
//   res.status(200).send("<h1>Get request success</h1>");
// });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success", status: 200 });
});

app.listen(PORT, () => {
  console.log(`Backend Server is running on PORT = ${PORT}....`);
});
