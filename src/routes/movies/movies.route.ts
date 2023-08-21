import { Router } from "express";
import moviesController from "../../controllers/movies/movies.controller";
import { schemaValidator } from "../../middlewares/schemaValidator";

const moviesRouter : Router = Router();

// Fetch movies (GET Methods)
moviesRouter.get('/fetch', moviesController.fetchMovies)

// Create movie (POST Methods)
moviesRouter.post('/create', schemaValidator('movieSchema'), moviesController.createMovie)

export default moviesRouter;