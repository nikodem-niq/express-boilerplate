import { Genres, IMoviesService, Movie } from "src/constants/types";

class MoviesService implements IMoviesService {
    createMovie(genres: Genres[], title: string, year: number, runtime: number, director: string, actors?: string, plot?: string, posterUrl?: string) : Movie {
        const mockedTestData : Movie = {
            id: 1,
            title: "Beetlejuice",
            year: 1988,
            runtime: 92,
            genres: [
                Genres.Comedy,
                Genres.Fantasy
            ],
            director: "Tim Burton",
            actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
            plot: "A couple of recently deceased ghosts contract the services of a \"bio-exorcist\" in order to remove the obnoxious new owners of their house.",
            posterUrl: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg"
        }

        return mockedTestData;
    }
}

export default new MoviesService();