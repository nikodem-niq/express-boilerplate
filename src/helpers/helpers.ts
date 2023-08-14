import fs from 'fs/promises';
import { errorLocales } from '../constants/locales';
import path from 'path';
import { DatabaseSchema } from '../constants/types';

/**
 * 
 * @param filePath 
 * @returns json data from db file or null if path is wrong
 */
export const readFile = async (filePath : string) : Promise<any> => {
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

export const writeFile = async (filePath : string, content: DatabaseSchema) : Promise<void> => {
    try {
        const pathParsed = path.join(__dirname, '..', '..', filePath);
        await fs.writeFile(pathParsed, JSON.stringify(content, null, 2), 'utf-8')
    } catch(error) {
        console.error(errorLocales.WRITE_FILE_ERROR);
    }
}