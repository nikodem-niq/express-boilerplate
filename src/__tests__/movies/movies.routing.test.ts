// import moviesController from '../src/controllers/movies/movies.controller';
import moviesService from '../../services/movies/movies.service';
import app from '../../app';
import request from 'supertest';

// env for tests purposes
process.env.NODE_ENV = 'test';

describe('Movies routing', () => {
    test('GET /movies/fetch should return a random movie', async () => {
      const response = await request(app).get('/movies/fetch');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    })

    test('GET /movies/fetch?duration=100 should return a movie with provided duration', async () => {
      const response = await request(app).get('/movies/fetch?duration=100');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(parseInt(response.body.runtime)).toBeGreaterThanOrEqual(90);
      expect(parseInt(response.body.runtime)).toBeLessThanOrEqual(110);
    })

    test('GET /movies/fetch?genres=Comedy should return a movie with provided genres', async () => {
      const response = await request(app).get('/movies/fetch?genres=Comedy');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body[0].genres[0]).toEqual('Comedy');
    })

    test('GET /movies/fetch?genres=X&duration=Y should return a movie with provided genres and duration', async () => {
      const response = await request(app).get('/movies/fetch?genres=Comedy&duration=100');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body[0].genres[0]).toEqual('Comedy');
      expect(parseInt(response.body[0].runtime)).toBeGreaterThanOrEqual(90);
      expect(parseInt(response.body[0].runtime)).toBeLessThanOrEqual(110);
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

    test('POST /movies/create should NOT create a movie (incorrect body)', async () => {
        const mockedMovieObjectWhichShouldFail = {
          genres: 1,
          title: "morethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100chars",
          director: "morethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100charsmorethan100chars",
          year: 'string',
          runtime: 'string',
          actors: ['a','b'],
          posterUrl: 123,
          plot: 999
        }

        const response = await request(app).post('/movies/create').send(
          mockedMovieObjectWhichShouldFail
        );
        expect(response.status).toBe(400);
        expect(response.body).not.toEqual(expect.objectContaining(mockedMovieObject));
        expect(response.body.error.details[0].message).toEqual('genres must be an array');
        expect(response.body.error.details[1].message).toEqual('year must be a number');
        expect(response.body.error.details[2].message).toEqual('runtime must be a number');
        expect(response.body.error.details[3].message).toEqual('director length must be less than or equal to 255 characters long');
        expect(response.body.error.details[4].message).toEqual('actors must be a string');
        expect(response.body.error.details[5].message).toEqual('plot must be a string');
        expect(response.body.error.details[6].message).toEqual('posterUrl must be a string');
    })

    test('POST /movies/create should NOT create a movie (empty object)', async () => {
        const emptyObject = Object.assign({});

        const response = await request(app).post('/movies/create').send(
          emptyObject
        );
        expect(response.status).toBe(400);
        expect(response.body).not.toEqual(expect.objectContaining(mockedMovieObject));
        expect(response.body.error.details[0].message).toEqual('genres is required');
        expect(response.body.error.details[1].message).toEqual('title is required');
        expect(response.body.error.details[2].message).toEqual('year is required');
        expect(response.body.error.details[3].message).toEqual('runtime is required');
        expect(response.body.error.details[4].message).toEqual('director is required');
    })
})