import { readFile } from "../../helpers/helpers";
import { Genres, IMoviesService, Movie } from "../../constants/types";

class MoviesService implements IMoviesService {
    async createMovie(genres: Genres[], title: string, year: number, runtime: number, director: string, actors?: string, plot?: string, posterUrl?: string) : Promise<Movie> {
        const mockedTestData : Movie = {
            id: 1,
            title,
            year,
            runtime,
            genres,
            director,
            actors,
            plot,
            posterUrl
        }
        const dbFile = await readFile('data/dbs.json');
        console.log(dbFile)
        return mockedTestData;
    }
}

export default new MoviesService();