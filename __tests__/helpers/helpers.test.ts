import {
  randomizeNumberInRange,
} from '../../src/helpers/helpers'; 

describe('Helper Functions', () => {
    test('should generate a random number within the specified range', () => {
        const min = 1;
        const max = 10;
        const result = randomizeNumberInRange(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(result).not.toBe(11);
    });
});
