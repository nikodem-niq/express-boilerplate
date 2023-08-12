import { Router } from "express";
import moviesRouter from "./movies/movies.route";

const appRouter : Router = Router();

// Movies routing
appRouter.use('/movies', moviesRouter)

export default appRouter;