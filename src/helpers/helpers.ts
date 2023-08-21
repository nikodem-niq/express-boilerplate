import fs from 'fs/promises';
import { messageLocales } from '../constants/locales';
import path from 'path';
import { DatabaseSchema } from '../constants/types';
import { config } from '../config/config';

/**
 * 
 * @returns database content or null if there was an error
 */
export const readDatabase = async () : Promise<any> => {
    try {
        const dbFile : DatabaseSchema = await readFile(config.db_path);
        if(!dbFile) {
            throw new Error(messageLocales.DATABASE_CONN_ERROR);
        }
        return dbFile;
    } catch(error) {
        console.error(error);
        return null;
    }
}
/**
 * 
 * @param content 
 * @returns message <string> if there was a problem with saving content to file or not
 */
export const writeDatabase = async (content: DatabaseSchema) : Promise<any> => {
    try {
        const writtenFile = await writeFile(config.db_path, content);
        return writtenFile;
    } catch(error) {
        console.error(error);
        return null;
    }
}

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
        console.error(messageLocales.READ_FILE_ERROR);
        return null;
    }
}

/**
 * 
 * @param filePath 
 * @param content 
 * @returns message <string> if file was saved successfully or not
 */
export const writeFile = async (filePath : string, content: DatabaseSchema) : Promise<string> => {
    try {
        const pathParsed = path.join(__dirname, '..', '..', filePath);
        await fs.writeFile(pathParsed, JSON.stringify(content, null, 2), 'utf-8');
        return messageLocales.WRITE_FILE_SUCCESS;
    } catch(error) {
        console.error(messageLocales.WRITE_FILE_ERROR);
        return messageLocales.WRITE_FILE_ERROR
    }
}

export const randomizeNumberInRange = (min: number, max: number) : number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min+1) + min);
}