import { readFile, writeFile } from "../../helpers/helpers";
import { DatabaseSchema, Genres, IMoviesService, Movie } from "../../constants/types";
import { errorLocales } from "../../constants/locales";
import Joi from "joi";
import { config } from "../../config/config";

class MoviesService implements IMoviesService {
    async createMovie(genres: Genres[], title: string, year: number, runtime: number, director: string, actors?: string, plot?: string, posterUrl?: string) : Promise<any> {
        const db : DatabaseSchema = await this.readDatabase();
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

            const writeToDb = await this.writeDatabase(db);
            console.log(writeToDb)
            //
            return validatedMovie;
        } catch(error) {
            return { error: errorLocales.OBJECT_SCHEMA_VALIDATION_ERROR };
        }
    }

    private async validateMovie(movie: Movie) : Promise<any> {
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

    private async readDatabase() : Promise<any> {
        try {
            const dbFile : DatabaseSchema = await readFile(config.db_path);
            if(!dbFile) {
                throw new Error(errorLocales.DATABASE_CONN_ERROR);
            }
            return dbFile;
        } catch(error) {
            console.error(error);
            return null;
        }
    }

    private async writeDatabase(content: DatabaseSchema) : Promise<any> {
        try {
            const writtenFile = await writeFile(config.db_path, content);
            return writtenFile;
        } catch(error) {
            console.error(error);
            return null;
        }
    }
}

export default new MoviesService();