const Movie = require("./../Models/moviesModel");

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find(req.query);

    res.status(200).json({
      status: "Success",
      NoofMovies: movies.length,
      data: {
        movies: movies,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.getAMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        movie: movie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

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

exports.updateAMovieById = async (req, res) => {
  try {
    const updtedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updtedMovie) {
      return res.status(404).json({
        status: "Fail",
        message: "No movie found with that ID",
      });
    }
    res.status(200).json({
      status: "Success",
      data: {
        updtedMovie: updtedMovie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

// exports.deleteAMovieById = async (req, res) => {
//   try {
//     const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//       status: "Success",
//       message: "Deleted movie successfully",
//       data: {
//         deletedMovie: deletedMovie,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "Fail",
//       message: error.message,
//     });
//   }
// };

exports.deleteAMovieById = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({
        status: "Fail",
        message: "No movie found with that ID",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Deleted movie successfully",
      data: {
        deletedMovie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};
