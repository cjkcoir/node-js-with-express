const express = require("express"); // Import the Express framework
const moviesControllers = require("./../Controllers/moviesControllers");
const authControllers = require("./../Controllers/authControllers");

const router = express.Router();

// router.param("id", (req, res, next, value) => {
//   console.log(`Movie Id = ${value}`);
//   next();
// });

router.route("/statistics").get(moviesControllers.getMoviesStatistics);

// router.param("id", moviesControllers.checkId);
router
  .route("/highest-rated")
  .get(
    moviesControllers.getTopThreeHighestRatingsMovies,
    moviesControllers.getAllMovies
  );

router
  .route("/")
  .get(authControllers.protect, moviesControllers.getAllMovies)
  .post(moviesControllers.createAMovie);
router
  .route("/:id")
  .get(moviesControllers.getAMovieById)
  .patch(moviesControllers.updateAMovieById)
  .delete(
    authControllers.protect,
    authControllers.restrict("admin", "ceo"),
    moviesControllers.deleteAMovieById
  );

module.exports = router;
