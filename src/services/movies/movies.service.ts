import { readFile, writeFile, readDatabase, writeDatabase, randomizeNumber } from "../../helpers/helpers";
import { DatabaseSchema, Genres, IMoviesService, Movie } from "../../constants/types";
import { messageLocales } from "../../constants/locales";
import Joi from "joi";

class MoviesService implements IMoviesService {
    async fetchRandomMovie() : Promise<any> {
        try {
            const db : DatabaseSchema = await readDatabase();
            const moviesLength : number = db.movies.length;
            const randomizedId = randomizeNumber(1, moviesLength);
            const { movies } = db;
            const randomizedMovie = movies.filter((movie : Movie) => movie.id === randomizedId);
            return randomizedMovie;
            
        } catch(error) {
            console.error(messageLocales.RESOURCE_FETCH_ERROR);
            return null;
        }
    }

    async createMovie(genres: Genres[], title: string, year: number, runtime: number, director: string, actors?: string, plot?: string, posterUrl?: string) : Promise<any> {
        const db : DatabaseSchema = await readDatabase();
        const moviesLength : number = db.movies.length;
        const movieObject : Movie = {
            id: moviesLength + 1,
            title,
            year,
            runtime,
            genres,
            director,
            actors,
            plot,
            posterUrl
        }
        try {
            const validatedMovie = await this.validateMovie(movieObject);
            // Save validated movie to db
            const { movies } = db;
            movies.push(validatedMovie);

            const pushObjectToDatabase = await writeDatabase(db);
            if(pushObjectToDatabase === messageLocales.WRITE_FILE_SUCCESS) {
                return validatedMovie;
            } 

            return messageLocales.WRITE_FILE_ERROR;
        } catch(error) {
            return { error: messageLocales.OBJECT_SCHEMA_VALIDATION_ERROR };
        }
    }

    // @ToDo
    // validating should generate text for each value if error occurs
    private async validateMovie(movie: Movie) : Promise<Movie> {
        const properMovieSchema = Joi.object({
            id: Joi.number().required(),
            genres: Joi.array().required(),
            title: Joi.string().max(255).required(),
            year: Joi.number().required(),
            runtime: Joi.number().required(),
            director: Joi.string().max(255).required(),
            actors: Joi.string().optional().default(""),
            plot: Joi.string().optional().default(""),
            posterUrl: Joi.string().optional().default(""),
        })

        const {error, value} = properMovieSchema.validate(movie);
        if(error) {
            throw new Error(error as unknown as string);
        };

        return value;
    }
}

export default new MoviesService();
