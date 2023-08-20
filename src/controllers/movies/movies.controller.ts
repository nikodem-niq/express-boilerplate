import type { Response, Request, NextFunction } from "express";
import { messageLocales } from "../../constants/locales";
import { IMoviesController, Genres, Movie } from "../../constants/types";
import moviesService from "../../services/movies/movies.service";

class MoviesController implements IMoviesController {
    public async fetchMovies(req: Request, res: Response, next: NextFunction) : Promise<Response> {
        const { duration, genres } = req.query;
        if(!duration && !genres) {
            const randomizedMovie = await moviesService.fetchRandomMovie();
            if(!randomizedMovie) {
                return res.status(400).json({error: messageLocales.RESOURCE_FETCH_ERROR});
            }
            return res.status(200).json(randomizedMovie);
        }

        if(duration && !genres) {
            const randomizedMovie = await moviesService.fetchMovieByParams(undefined, Number(duration));
            if(!randomizedMovie) {
                return res.status(400).json({error: messageLocales.RESOURCE_FETCH_ERROR});
            }

            return res.status(200).json(randomizedMovie);
        }

        if(genres) {
            let sortedMovies : Array<Movie> = [];
            const splittedQuery : Array<string> | Array<Genres> = genres.toString().split(',');
            let matchedGenres : Array<Genres> = []
            if(Array.isArray(splittedQuery)) {
                splittedQuery.forEach(genre => {
                    if(Object.values<string>(Genres).includes(genre)) {
                        matchedGenres.push(genre as Genres);
                    };
                });
            } else {
                return res.status(400).json({error: messageLocales.QUERY_PARAM_ERROR});
            }

            // If duration provided
            duration ? 
            sortedMovies = await moviesService.fetchMovieByParams(matchedGenres, Number(duration)) :
            sortedMovies = await moviesService.fetchMovieByParams(matchedGenres);

            if(!sortedMovies) {
                return res.status(400).json({error: messageLocales.RESOURCE_FETCH_ERROR});
            }
            return res.status(200).json(sortedMovies);
        }

        return res.status(400).json({error: messageLocales.RESOURCE_FETCH_ERROR});
    }

    public async createMovie(req: Request, res: Response, next: NextFunction) : Promise<Response> {
        const { genres, title, year, runtime, director, actors, plot, posterUrl } = req.body;

        // Genres parsing
        let matchedGenres : Array<Genres> = []
        if(Array.isArray(genres)) {
            genres.forEach(genre => {
                if(Object.values<string>(Genres).includes(genre)) {
                    matchedGenres.push(genre);
                };
            });
        } else {
            return res.status(400).json({error: messageLocales.PROPERTY_WRONG_TYPE});
        }
        
        const data = await moviesService.createMovie(matchedGenres, title, year, runtime, director, actors, plot, posterUrl);

        if(data.error) {
            return res.status(400).json({error: data.error});
        }

        if(!data) {
            return res.status(400).json({error: messageLocales.RESOURCE_ADD_ERROR});
        }

        return res.status(200).json(data);
    }
}

export default new MoviesController();
