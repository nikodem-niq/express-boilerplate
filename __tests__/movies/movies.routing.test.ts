// import moviesController from '../src/controllers/movies/movies.controller';
import moviesService from '../../src/services/movies/movies.service';
import app from '../../src/app';
import request from 'supertest';

// env for tests purposes
process.env.NODE_ENV = 'test';

describe('Movies routing', () => {
  test('GET /movies/fetch should return a random movie', async () => {
    const response = await request(app).get('/movies/fetch');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  })

  test('GET /movies/fetch?duration=X should return a movie with provided duration', async () => {
    const response = await request(app).get('/movies/fetch?duration=100');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  })

  test('GET /movies/fetch?genres=X should return a movie with provided genres', async () => {
    const response = await request(app).get('/movies/fetch?genres=Comedy');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  })

  test('GET /movies/fetch?genres=X&duration=Y should return a movie with provided genres and duration', async () => {
    const response = await request(app).get('/movies/fetch?genres=Comedy&duration=100');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  })

  // Post 
  const mockedMovieObject = {
    genres: ["Comedy", "Drama"],
    title: "Test movie",
    director: "Test director",
    year: 2016,
    runtime: 90
  }

  test('POST /movies/create should create a movie', async () => {
    const response = await request(app).post('/movies/create').send(
      mockedMovieObject
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(mockedMovieObject));
  })
  // Post which fails

  test('POST /movies/create should NOT create a movie', async () => {
    const mockedMovieObjectWhichShouldFail = {
      genres: ["Comedy", "Drama", "horor"],
      title: "morethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100chars",
      director: "morethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100chars",
      year: 'string',
      runtime: 'string'
    }

    const response = await request(app).post('/movies/create').send(
      mockedMovieObjectWhichShouldFail
    );
    expect(response.status).toBe(400);
    expect(response.body).not.toEqual(expect.objectContaining(mockedMovieObject));
  })
})