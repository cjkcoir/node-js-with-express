const mongoose = require("mongoose");
const validator = require("validator");

const moviesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    maxlength: [
      100,
      "Movie Name length must not have more than 100 characters",
    ],
    minlength: [4, "Movie Name length should have atleast 4 characters"],
    trim: true,
    validate: [validator.isAlpha, "Name should be only alphabets"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  ratings: {
    type: Number,
    // min: [1, "Ratings can be >= 1 to <=10"],
    // max: [10, "Ratings can be >= 1 to <=10"],

    validate: {
      validator: function (value) {
        return value >= 1 && value <= 10;
      },

      message: "Ratings -({VALUE})--should be >=1 to <=10",
    },
  },
  totalRatings: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, "Release Year is required"],
  },
  releaseDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  genres: {
    type: [String],
    required: [true, "Genres is required"],
    enum: {
      values: [
        "Sci-Fi",
        "Thriller",
        "Action",
        "Drama",
        "Historical",
        "Adventure",
        "Biography",
        "Crime",
        "Romance",
      ],
      message: "This Genre does not exist",
    },
  },
  directors: {
    type: [String],
    required: [true, "Directors is required"],
  },
  coverImage: {
    type: String,
    required: [true, "Cover image is required"],
  },
  actors: {
    type: [String],
    required: [true, "Actors is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});

const Movie = mongoose.model("Movie", moviesSchema);
module.exports = Movie;
