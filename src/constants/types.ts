import type { Request, Response, NextFunction } from "express"

// Interfaces
export interface IMoviesController {
    fetchMovies(req: Request, res: Response, next: NextFunction) : Promise<void>,
    createMovie(req: Request, res: Response, next: NextFunction) : Promise<void>,
}

export interface IMoviesService {
    createMovie(genres : Genres[], title: string, year: number, runtime: number, director: string, actors?: string, plot?: string, posterUrl?: string) : Promise<Movie>
}
// Enums
export enum Genres {
    Comedy = "Comedy",
    Fantasy = "Fantasy",
    Crime = "Crime",
    Drama = "Drama",
    Music = "Music",
    Adventure = "Adventure",
    History = "History",
    Thriller = "Thriller",
    Animation = "Animation",
    Family = "Family",
    Mystery = "Mystery",
    Biography = "Biography",
    Action = "Action",
    FilmNoir = "Film-Noir",
    Romance = "Romance",
    SciFi = "Sci-Fi",
    War = "War",
    Western = "Western",
    Horror = "Horror",
    Musical = "Musical",
    Sport = "Sport"
}

// Types

export type Movie = {
    id: number,
    title: string,
    year: number,
    runtime: number,
    genres: Genres[],
    director: string,
    actors?: string,
    plot?: string,
    posterUrl?: string
}

export type DatabaseSchema = {
    genres: Genres[],
    movies: Movie[]
}