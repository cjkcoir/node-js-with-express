const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.status(200).send("<h1>Get request success</h1>");
});

app.listen(PORT, () => {
  console.log(`Backend Server is running on PORT = ${PORT}....`);
});
