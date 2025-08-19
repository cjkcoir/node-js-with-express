const express = require("express"); // Import the Express framework
const moviesControllers = require("./../Controllers/moviesControllers");

const router = express.Router();

router
  .route("/")
  .get(moviesControllers.getAllMovies)
  .post(moviesControllers.createAMovie);
router
  .route("/:id")
  .get(moviesControllers.getAMovieById)
  .patch(moviesControllers.updateAMovieById)
  .delete(moviesControllers.deleteAMovieById);

module.exports = router;
