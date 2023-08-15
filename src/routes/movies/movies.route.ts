import { Router } from "express";
import moviesController from "../../controllers/movies/movies.controller";

const moviesRouter : Router = Router();

// Fetch movies (GET Methods)
moviesRouter.get('/fetch', moviesController.fetchMovies)

// Create movie (POST Methods)
moviesRouter.post('/create', moviesController.createMovie)

export default moviesRouter;