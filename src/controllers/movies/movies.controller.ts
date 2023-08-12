import type { Response, Request, NextFunction } from "express";
import { errorLocales } from "../../constants/locales";
import type { IMoviesController } from "../../constants/types";
import moviesService from "src/services/movies/movies.service";

class MoviesController implements IMoviesController {
    async fetchMovies(req: Request, res: Response, next: NextFunction) : Promise<void> {
        res.status(200).send('hey fetch')
    }

    async createMovie(req: Request, res: Response, next: NextFunction) : Promise<void> {
        const { genres, title, year, runtime, director, actors, plot, posterUrl } = req.body;
        if(!genres || !title || !runtime || !director || !year) {
            res.status(400).send(errorLocales.PROPERTY_MISSING);
            return;
        }
        
        const data = moviesService.createMovie(genres, title, year, runtime, director);
        res.send(data);
    }
}

export default new MoviesController();
