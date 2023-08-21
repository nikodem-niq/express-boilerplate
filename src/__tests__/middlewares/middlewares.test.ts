import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { schemaValidator } from '../../middlewares/schemaValidator'; 
import schemas from '../../schemas/schemas'; 

const app = express();

app.use(express.json());

app.post('/test', schemaValidator('movieSchema'), (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(req.body);
});

describe('Schema validator middleware', () => {
  it('should pass validation with valid data', async () => {
    const movieObject = {
        genres: ['Comedy'],
        title: 'Test Movie',
        year: 2022,
        runtime: 120,
        director: 'Test Director',
      }
    const response = await request(app)
      .post('/test')
      .send(movieObject);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual(expect.objectContaining(movieObject));
  });

  it('should return 400 with invalid data', async () => {
    const response = await request(app)
      .post('/test')
      .send({
        genres: ['Comedy'],
        title: 'Test Movie',
        year: 2022,
        runtime: 120,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', 'error');
  });

  it('should have a valid movieSchema', async () => {
    const result = schemas['movieSchema'].validate({
      genres: ['Comedy'],
      title: 'Test Movie',
      year: 2022,
      runtime: 120,
      director: 'Test Director',
    });

    expect(result.error).toBeUndefined();
  });

  it('should catch invalid movieSchema', async () => {
    const result = schemas['movieSchema'].validate({
      genres: ['Comedy'],
      year: 2022,
      runtime: 120,
      director: 'Test Director',
    });

    expect(result.error).toBeDefined();
  });
});
