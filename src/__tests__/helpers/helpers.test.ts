import {
  randomizeNumberInRange, readDatabase,
} from '../../helpers/helpers'; 
import fs from 'fs/promises';

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

describe('Helper Functions', () => {
    test('should generate a random number within the specified range', () => {
        const min = 1;
        const max = 10;
        const result = randomizeNumberInRange(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(result).not.toBe(11);
    });

    it('should read database file', async () => {
      const dbFileContent = {
          "genres": [
            "Comedy",
            "Fantasy",
            "Crime",
            "Drama",
            "Music",
            "Adventure",
            "History",
            "Thriller",
            "Animation",
            "Family",
            "Mystery",
            "Biography",
            "Action",
            "Film-Noir",
            "Romance",
            "Sci-Fi",
            "War",
            "Western",
            "Horror",
            "Musical",
            "Sport"
          ],
          "movies": [
            {
              "id": 1,
              "title": "Beetlejuice",
              "year": "1988",
              "runtime": "92",
              "genres": [
                "Comedy",
                "Fantasy"
              ],
              "director": "Tim Burton",
              "actors": "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
              "plot": "A couple of recently deceased ghosts contract the services of a \"bio-exorcist\" in order to remove the obnoxious new owners of their house.",
              "posterUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg"
            }]
      };
  
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(dbFileContent));
  
      const result = await readDatabase();  
      expect(result).toEqual(dbFileContent);
      expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), { encoding: 'utf-8' });
    });

    it('should handle file read error', async () => {
      const errorMessage = 'error';
      (fs.readFile as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
      const result = await readDatabase();
  
      expect(result).toBeNull();
    });
});
