const Movie = require("./../Models/moviesModel");
const { MongooseQueryParser } = require("mongoose-query-parser");

const qs = require("qs");
const ApiFeatures = require("./../Utils/ApiFeatures");

exports.getTopThreeHighestRatingsMovies = (req, res, next) => {
  req.query.limit = "3";
  req.query.sort = "-ratings";
  next();
};

exports.getAllMovies = async (req, res) => {
  try {
    const features = new ApiFeatures(Movie.find(), req.query)
      .sort()
      .filter()
      .limitFields()
      .paginate();

    let movies = await features.query;
    // Parse raw query for advanced filtering
    // const parsedQuery = qs.parse(req._parsedUrl.query);
    // const parsedQuery = req.query;

    // Clone the query object and remove special fields
    // const queryObj = { ...parsedQuery };
    // const excludedFields = ["sort", "page", "limit", "fields"];
    // excludedFields.forEach((field) => delete queryObj[field]);

    // // Convert operators to MongoDB format
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // const filter = JSON.parse(queryStr);

    // // Build the query
    // let query = Movie.find(filter);

    // Apply sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // }

    // // ✅ Apply limit
    // if (req.query.limit) {
    //   const limit = parseInt(req.query.limit, 10);
    //   query = query.limit(limit);
    // }

    // Apply field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // //PAGINATION STARTS HERE

    // // Extract the page number from query params, convert it to a number (*1 trick), default to 1 if not provided
    // const page = req.query.page * 1 || 1;

    // // Extract the limit (number of documents per page) from query params, convert to number, default to 5
    // const limit = req.query.limit * 1 || 5;

    // // Calculate how many documents to skip before fetching the current page
    // const skip = (page - 1) * limit;

    // // Apply skip and limit to the query (pagination logic)
    // query = query.skip(skip).limit(limit);

    // // If a specific page is requested, check whether it actually exists
    // if (req.query.page) {
    //   // Count total number of documents in the Movie collection
    //   const moviesCount = await Movie.countDocuments();

    //   // If skip value exceeds total documents, the page doesn't exist
    //   if (skip >= moviesCount) {
    //     throw new Error("This page is not found");
    //   }
    // }

    // Execute query
    // const movies = await query;

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
