const Movie = require("./../Models/moviesModel");
const { MongooseQueryParser } = require("mongoose-query-parser");
const parser = new MongooseQueryParser();
const q2m = require("query-to-mongo");

exports.getAllMovies = async (req, res) => {
  try {
    // let queryString = JSON.stringify(req.query);

    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`
    // );
    // console.log(queryString);

    // let queryObject = JSON.parse(queryString);

    // console.log(queryObject);

    // const movies = await Movie.find(queryObject);

    // // Parse query params
    // const parsed = parser.parse(req.query);

    // console.log(parsed);

    // // parsed.filter will contain MongoDB-ready object
    // const movies = await Movie.find(parsed.filter);

    // const query = q2m(req.query);

    // console.log(query.criteria); // Mongo-ready filter
    // const movies = await Movie.find(query.criteria);

    // let queryString = JSON.stringify(req.query);

    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`
    // );

    // const queryObject = JSON.parse(queryString);
    // console.log("Final Query Object:", queryObject);

    console.log(req.query);

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
