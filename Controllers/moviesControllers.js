const Movie = require("./../Models/moviesModel");

exports.getAllMovies = (req, res) => {};

exports.getAMovieById = (req, res) => {};

exports.createAMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: "Success",
      data: {
        createdMovie: movie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.updateAMovieById = (req, res) => {};

exports.deleteAMovieById = (req, res) => {};
