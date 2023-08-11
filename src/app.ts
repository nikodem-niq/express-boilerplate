import express from 'express';
import xss from 'xss';

const app = express();

// Middlewares for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;