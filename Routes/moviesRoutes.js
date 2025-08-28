const express = require("express"); // Import the Express framework
const moviesControllers = require("./../Controllers/moviesControllers");

const router = express.Router();

// router.param("id", (req, res, next, value) => {
//   console.log(`Movie Id = ${value}`);
//   next();
// });

// router.param("id", moviesControllers.checkId);

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
