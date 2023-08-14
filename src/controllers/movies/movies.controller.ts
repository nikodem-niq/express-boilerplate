import type { Response, Request, NextFunction } from "express";
import { errorLocales } from "../../constants/locales";
import { IMoviesController, Genres } from "../../constants/types";
import moviesService from "../../services/movies/movies.service";

class MoviesController implements IMoviesController {
    async fetchMovies(req: Request, res: Response, next: NextFunction) : Promise<void> {
        res.status(200).send('hey fetch')
    }

    async createMovie(req: Request, res: Response, next: NextFunction) : Promise<void> {
        const { genres, title, year, runtime, director, actors, plot, posterUrl } = req.body;
        if(!genres || !title || !runtime || !director || !year) {
            res.status(400).json({error: errorLocales.PROPERTY_MISSING});
            return;
        }

        // Genres parsing
        let matchedGenres : Array<Genres> = []
        if(Array.isArray(genres)) {
            genres.forEach(genre => {
                if(Object.values<string>(Genres).includes(genre)) {
                    matchedGenres.push(genre);
                };
            });
        } else {
            res.status(400).json({error: errorLocales.PROPERTY_WRONG_TYPE});
            return;
        }

        // Params parsing
        if(
            matchedGenres.length === 0 ||
            typeof title !== 'string' ||
            typeof year !== 'number' ||
            typeof runtime !== 'number' ||
            typeof director !== 'string' ||
            (actors && typeof actors !== 'string') ||
            (plot && typeof plot !== 'string') ||
            (posterUrl && typeof posterUrl !== 'string')
        ) {
            res.status(400).json({error: errorLocales.PROPERTY_WRONG_TYPE});
            return;
        }

        
        const data = await moviesService.createMovie(matchedGenres, title, year, runtime, director, actors, plot, posterUrl);

        if(data.error) {
            res.status(400).json({error: data.error});
            return;
        }

        if(!data) {
            res.status(400).json({error: errorLocales.RESOURCE_ADD_ERROR});
            return;
        }

        res.status(200).json(data);
    }
}

export default new MoviesController();
