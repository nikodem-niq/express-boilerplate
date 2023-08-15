import type { Response, Request, NextFunction } from "express";
import { messageLocales } from "../../constants/locales";
import { IMoviesController, Genres } from "../../constants/types";
import moviesService from "../../services/movies/movies.service";

class MoviesController implements IMoviesController {
    async fetchMovies(req: Request, res: Response, next: NextFunction) : Promise<void> {
        const { duration, genres } = req.query;
        if(!duration && !genres) {
            const randomizedMovie = await moviesService.fetchRandomMovie();
            if(!randomizedMovie) {
                res.status(400).json({error: messageLocales.RESOURCE_FETCH_ERROR});
                return;
            }
            res.status(200).json(randomizedMovie);
            return;
        }

        if(duration && !genres) {
            const randomizedMovie = await moviesService.fetchMovieByParams(undefined, Number(duration));
            if(!randomizedMovie) {
                res.status(400).json({error: messageLocales.RESOURCE_FETCH_ERROR});
                return;
            }

            res.status(200).json(randomizedMovie);
            return;
        }

        if(genres && !duration) {
            const splittedQuery : Array<string> | Array<Genres> = genres.toString().split(',');
            let matchedGenres : Array<Genres> = []
            if(Array.isArray(splittedQuery)) {
                splittedQuery.forEach(genre => {
                    if(Object.values<string>(Genres).includes(genre)) {
                        matchedGenres.push(genre as Genres);
                    };
                });
            } else {
                res.status(400).json({error: messageLocales.QUERY_PARAM_ERROR});
                return;
            }

            const sortedMovies = await moviesService.fetchMovieByParams(matchedGenres);
            if(!sortedMovies) {
                res.status(400).json({error: messageLocales.RESOURCE_FETCH_ERROR});
                return;
            }
            res.status(200).json(sortedMovies);
            return;
        }

        if(genres && duration) {

        }

        res.status(400).json({error: messageLocales.RESOURCE_FETCH_ERROR});
    }

    async createMovie(req: Request, res: Response, next: NextFunction) : Promise<void> {
        const { genres, title, year, runtime, director, actors, plot, posterUrl } = req.body;
        if(!genres || !title || !runtime || !director || !year) {
            res.status(400).json({error: messageLocales.PROPERTY_MISSING});
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
            res.status(400).json({error: messageLocales.PROPERTY_WRONG_TYPE});
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
            res.status(400).json({error: messageLocales.PROPERTY_WRONG_TYPE});
            return;
        }

        
        const data = await moviesService.createMovie(matchedGenres, title, year, runtime, director, actors, plot, posterUrl);

        if(data.error) {
            res.status(400).json({error: data.error});
            return;
        }

        if(!data) {
            res.status(400).json({error: messageLocales.RESOURCE_ADD_ERROR});
            return;
        }

        res.status(200).json(data);
    }
}

export default new MoviesController();
