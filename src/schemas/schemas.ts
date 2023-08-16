import Joi, { ObjectSchema } from "joi";

const movieSchema = Joi.object({
    genres: Joi.array().required(),
    title: Joi.string().max(255).required(),
    year: Joi.number().required(),
    runtime: Joi.number().required(),
    director: Joi.string().max(255).required(),
    actors: Joi.string().optional().default(""),
    plot: Joi.string().optional().default(""),
    posterUrl: Joi.string().optional().default(""),
})

export default {
    'movieSchema' : movieSchema
} as {
    [key: string] : ObjectSchema
};
