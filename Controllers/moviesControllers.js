const fs = require("fs"); // Import the built-in File System module

const movies = JSON.parse(fs.readFileSync("./data/movies.json"));
// Read the movies.json file synchronously and parse its JSON content into a JS object

exports.checkId = (req, res, next, value) => {
  let movie = movies.find((element) => element.id === value * 1);
  console.log(`Movie Id = ${value}`);
  if (!movie) {
    return res.status(404).json({
      status: "Failed to get a Movie by ID",
      requestedAt: req.requestedAt,
      message: `Movie with id = ${value} is not in the Database`,
    });
  }

  next();
};

exports.getAllMovies = (req, res) => {
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
};

exports.getAMovieById = (req, res) => {
  const id = req.params.id * 1;
  let movie = movies.find((element) => element.id === id);

  res.status(200).json({
    // Send an HTTP 200 (OK) response in JSON format --METHOD CHAINING
    message: "Success", // Include a success message
    requestedAt: req.requestedAt,
    data: {
      // Wrap movie data inside a "data" object --ENVELOPING
      movie: movie, // Send the movies list from the file
    },
  });
};

exports.validateReqBody = (req, res, next) => {
  if (!req.body.name || !req.body.releaseYear || !req.body.duration) {
    return res.status(400).json({
      status: "Fail",
      message:
        "Request Body should contain name,releaseYear & duration of Movie",
    });
  }
  next(); // ✅ continue to createAMovie
};

exports.createAMovie = (req, res) => {
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
};

exports.updateAMovieById = (req, res) => {
  const id = req.params.id * 1;
  let movieToUpdate = movies.find((element) => element.id === id);

  const index = movies.indexOf(movieToUpdate);
  const updatedMovieObject = Object.assign(movieToUpdate, req.body);
  movies[index] = updatedMovieObject;
  fs.writeFile("./data/movies.json", JSON.stringify(movies), () => {
    res.status(200).json({
      // Send an HTTP 200 (OK) response in JSON format --METHOD CHAINING
      status: "Success",
      message: `Successfully Updated a Movie with ID = ${id}`, // Include a success message
      requestedAt: req.requestedAt,
      data: {
        UpdatedMovie: updatedMovieObject,
      },
    });
  });
};

exports.deleteAMovieById = (req, res) => {
  const id = req.params.id * 1;
  let movieToUpdate = movies.find((element) => element.id === id);

  const index = movies.indexOf(movieToUpdate);
  movies.splice(index, 1);
  fs.writeFile("./data/movies.json", JSON.stringify(movies), () => {
    res.status(200).json({
      // Send an HTTP 200 (OK) response in JSON format --METHOD CHAINING
      status: "Success",
      message: `Successfully deleted a Movie with ID = ${id}`, // Include a success message
      requestedAt: req.requestedAt,
      data: {
        DeletedMovie: movieToUpdate,
      },
    });
  });
};
