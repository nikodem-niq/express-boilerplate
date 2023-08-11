import { configDotenv } from "dotenv";
import Joi from "joi";
configDotenv();

export enum Environments {
    Development = 'Development',
    Production = 'Production'
}

const envSchema = Joi.object().keys({ 
    PORT: Joi.number().description('Server port'),
    NODE_ENV: Joi.string().valid('development', 'production').required().description('Node environment - production/development'),
    SESSION_COOKIE_SECRET: Joi.string().required().min(10).description('Secret for session which avoid XSS'),
}).unknown();

const { value: envValue, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if(error) {
    
}
// export const config = {
//     port: envValue.PORT,
//     env: envValue.NODE_ENV,
//     session_cookie_secret: envValue.SESSION_COOKIE_SECRET
// }
export const config = {
    envValue
}

type Port = number;