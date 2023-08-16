import { readDatabase, writeDatabase, randomizeNumberInRange } from "../../helpers/helpers";
import { DatabaseSchema, Genres, IMoviesService, Movie } from "../../constants/types";
import { messageLocales } from "../../constants/locales";
import Joi from "joi";

class MoviesService implements IMoviesService {
    public async fetchRandomMovie() : Promise<any> {
        try {
            const db : DatabaseSchema = await readDatabase();
            const moviesLength : number = db.movies.length;
            const randomizedId = randomizeNumberInRange(1, moviesLength);
            const { movies } = db;

            const randomizedMovie = movies.filter((movie : Movie) => movie.id === randomizedId);
            return randomizedMovie;
            
        } catch(error) {
            console.error(messageLocales.RESOURCE_FETCH_ERROR);
            return null;
        }
    }

    public async fetchMovieByParams(genres? : Genres[], duration? : number) : Promise<any> {
        try {
            const db : DatabaseSchema = await readDatabase();
            const { movies } = db;

            // Only duration provided
            if(duration && !genres) {
                const filteredMovies = movies.filter((movie : Movie) => (Number(movie.runtime) > Number(duration-10) && Number(movie.runtime) < Number(duration+10)));
                const randomizedId = randomizeNumberInRange(0, filteredMovies.length-1);
                const randomizedMovie = filteredMovies[randomizedId];
                return randomizedMovie;
            }

            // Only genres provided
            if(genres && !duration) {
                const filteredArray = movies.filter((movie: Movie) => movie.genres.every((genre) => genres.includes(genre)));
                const sortedArray = filteredArray.sort((a: Movie, b: Movie) => b.genres.length - a.genres.length);
                return sortedArray;
            }

            // Both params provided
            if(genres && duration) {
                const filteredArrayByGenres = movies.filter((movie: Movie) => movie.genres.every((genre) => genres.includes(genre)));
                const filteredArrayByDuration = filteredArrayByGenres.filter((movie : Movie) => (Number(movie.runtime) > Number(duration-10) && Number(movie.runtime) < Number(duration+10)));
                const sortedArray = filteredArrayByDuration.sort((a: Movie, b: Movie) => b.genres.length - a.genres.length);
                return sortedArray;
            }

            return null;

        } catch(error) {
            console.error(messageLocales.RESOURCE_FETCH_ERROR);
            return null;
        }
    }

    async createMovie(genres: Genres[], title: string, year: number, runtime: number, director: string, actors?: string, plot?: string, posterUrl?: string) : Promise<any> {
        try {
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

            const { movies } = db;
            movies.push(movieObject);

            const pushObjectToDatabase = await writeDatabase(db);
            if(pushObjectToDatabase === messageLocales.WRITE_FILE_SUCCESS) {
                return movieObject;
            } 

            return messageLocales.WRITE_FILE_ERROR;
        } catch(error) {
            return { error: messageLocales.OBJECT_SCHEMA_VALIDATION_ERROR };
        }
    }

    // @ToDo
    // validating should generate text for each value if error occurs
    // express-validator
    /*
        validating in validators folder
        create an instance of validator with custom error messages
        create method in this class for writing to db
        write to db after validating in controller
        

    */
}

export default new MoviesService();
