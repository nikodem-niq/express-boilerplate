import fs from 'fs/promises';
import { errorLocales } from '../constants/locales';
import path from 'path';

/**
 * 
 * @param filePath 
 * @returns json data from db file or null if path is wrong
 */
export const readFile = async (filePath : string) => {
    try {
        const pathParsed = path.join(__dirname, '..', '..', filePath);
        const fileData = await fs.readFile(pathParsed, {encoding: 'utf-8'});
        const parsedData = JSON.parse(fileData);
        return parsedData;
    } catch(error) {
        console.error(errorLocales.READ_FILE_ERROR);
        return null;
    }
}