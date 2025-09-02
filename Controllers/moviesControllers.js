const Movie = require("./../Models/moviesModel");
const { MongooseQueryParser } = require("mongoose-query-parser");

const qs = require("qs");

exports.getTopThreeHighestRatingsMovies = (req, res, next) => {
  req.query.limit = "3";
  req.query.sort = "-ratings";
  next();
};

exports.getAllMovies = async (req, res) => {
  try {
    // Parse raw query for advanced filtering
    // const parsedQuery = qs.parse(req._parsedUrl.query);
    const parsedQuery = req.query;

    // Clone the query object and remove special fields
    const queryObj = { ...parsedQuery };
    const excludedFields = ["sort", "page", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert operators to MongoDB format
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const filter = JSON.parse(queryStr);

    // Build the query
    let query = Movie.find(filter);

    // Apply sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    // ✅ Apply limit
    if (req.query.limit) {
      const limit = parseInt(req.query.limit, 10);
      query = query.limit(limit);
    }

    // Apply field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const moviesCount = await Movie.countDocuments();
      if (skip >= moviesCount) {
        throw new Error("This page is not found");
      }
    }

    // Execute query
    const movies = await query;

    res.status(200).json({
      status: "Success",
      NoofMovies: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

// exports.getAllMovies = async (req, res) => {

//   try {
//     // Parse the raw query string to support nested parameters like ratings[gte]
//     const parsedQuery = qs.parse(req._parsedUrl.query);

//     // Log the parsed query for debugging
//     console.log(parsedQuery);

//     // Convert the parsed query object to a string for regex manipulation
//     let queryString = JSON.stringify(parsedQuery);

//     // Replace operators like gte, lt with MongoDB equivalents ($gte, $lt)
//     queryString = queryString.replace(
//       /\b(gte|gt|lte|lt)\b/g,
//       (match) => `$${match}`
//     );

//     // Parse the modified string back into an object
//     let queryObject = JSON.parse(queryString);

//     // Ensure it's a plain object (not a prototype chain object)
//     queryObject = { ...queryObject };

//     // Log the final query object to verify MongoDB filter structure
//     console.log(queryObject);

//     let query = Movie.find(queryObject);

//     if (req.query.sort) {
//       query = query.sort(req.query.sort);
//     }

//     // Query the Movie collection using the constructed filter
//     const movies = await query;

//     // Send a success response with the number of movies and the data
//     res.status(200).json({
//       status: "Success",
//       NoofMovies: movies.length,
//       data: {
//         movies: movies,
//       },
//     });
//   } catch (error) {
//     // Handle any errors and send a failure response
//     res.status(400).json({
//       status: "Fail",
//       message: error.message,
//     });
//   }
// };

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
