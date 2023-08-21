import { readDatabase, writeDatabase, randomizeNumberInRange } from "../../helpers/helpers";
import { DatabaseSchema, Genres, IMoviesService, Movie } from "../../constants/types";
import { messageLocales } from "../../constants/locales";

class MoviesService implements IMoviesService {
/**
 * 
 * @returns random movie
 */
    public async fetchRandomMovie() : Promise<Movie[]> {
        try {
            const db : DatabaseSchema = await readDatabase();
            const moviesLength : number = db.movies.length;
            const randomizedId = randomizeNumberInRange(1, moviesLength);
            const { movies } = db;

            const randomizedMovie = movies.filter((movie : Movie) => movie.id === randomizedId);
            return randomizedMovie;
            
        } catch(error) {
            console.error(messageLocales.RESOURCE_FETCH_ERROR, error);
            return [];
        }
    }

/**
 * 
 * @param genres 
 * @param duration 
 * @returns randomized movie if there are no parameters or filtered movies list by provided parameters
 */
    public async fetchMovieByParams(genres? : Genres[], duration? : number) : Promise<Movie | Movie[]> {
        try {
            const db : DatabaseSchema = await readDatabase();
            const { movies } = db;

            // Only duration provided
            if(duration && !genres) {
                const filteredMovies = this.filterMoviesByDuration(movies, duration);
                const randomizedId = randomizeNumberInRange(0, filteredMovies.length-1);
                const randomizedMovie = filteredMovies[randomizedId];
                return randomizedMovie;
            }

            // Only genres provided
            if(genres && !duration) {
                return this.parseDuplicates(this.filterMoviesByGenres(movies, genres));
            }

            // Both params provided
            if(genres && duration) {
                const filteredMovies = this.filterMoviesByDuration(this.filterMoviesByGenres(movies, genres), duration);

                return this.parseDuplicates(filteredMovies);
            }

            return [];

        } catch(error) {
            console.error(messageLocales.RESOURCE_FETCH_ERROR, error);
            return [];
        }
    }
/**
 * 
 * @param genres 
 * @param title 
 * @param year 
 * @param runtime 
 * @param director 
 * @param actors 
 * @param plot 
 * @param posterUrl 
 * @returns movieObject if created successfully or undefined if there is a problem with saving to database
 */
    public async createMovie(genres: Genres[], title: string, year: number, runtime: number, director: string, actors?: string, plot?: string, posterUrl?: string) : Promise<Movie | {error: string}> {
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

            const movieSaveToDbTask = await writeDatabase(db);
            if(movieSaveToDbTask === messageLocales.WRITE_FILE_SUCCESS) {
                return movieObject;
            } 

            return { error: messageLocales.DATABASE_CONN_ERROR };
        } catch(error) {
            console.error(messageLocales.DATABASE_CONN_ERROR, error);
            return { error: messageLocales.DATABASE_CONN_ERROR };
        }
    }

/**
 * 
 * @param movies 
 * @param duration 
 * @returns movies array filtered by duration
 */
    private filterMoviesByDuration(movies: Movie[], duration: number) : Movie[] {
        const filteredMovies = movies.filter(
            (movie : Movie) => 
            (Number(movie.runtime) > Number(duration-10) && 
            Number(movie.runtime) < Number(duration+10)));

        return filteredMovies;
    }

/**
 * 
 * @param movies 
 * @param genres 
 * @returns movies array filtered and sorted by genres
 */
    private filterMoviesByGenres(movies: Movie[], genres: Genres[]) : Movie[] {
        const filteredArray = movies.filter(
            (movie: Movie) => 
            movie.genres.every((genre) => 
            genres.includes(genre)));

        const sortedArray = filteredArray.sort(
            (a: Movie, b: Movie) => 
            b.genres.length - a.genres.length);
            
        return sortedArray;
    }

/**
 * 
 * @param movies 
 * @returns parsed movies array with no duplicates
 */
    private parseDuplicates(movies: Movie[]): Movie[] {
        const filteredMovies: Movie[] = [];
        const usedIds: number[] = [];
      
        for (const movie of movies) {
            if (!usedIds.includes(movie.id)) {
                usedIds.push(movie.id);
                filteredMovies.push(movie);
            }
        }
      
        return filteredMovies;
    }
}

export default new MoviesService();
