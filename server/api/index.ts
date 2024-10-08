import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import 'dotenv/config';

import mlRoutes from "../src/routes/meteoriteLandingsRoutes";
import classifRoutes from "../src/routes/classificationsRoutes";
import colorRoutes from "../src/routes/colorRoutes";
import errorHandler from "../src/middleware/errorHandler";
import customCorsMiddleWare from "../src/middleware/cors";
import { connectToDatabase } from "../src/db/db";

const logger = pino();
const app = express();
const PORT: number = parseInt(process.env.SERVER_PORT);

app.use(cors({
    origin: process.env.CLIENT_APP_ORIGIN_URL
}));
// Middleware CORS custom
// app.use(customCorsMiddleWare);

app.use(helmet());
app.use(express.json()); // Pour parser le JSON dans les requêtes

// Reduce fingerprinting: the ability for an external program to determine the software that the server uses. It doesn't prevent sophisticated attacks, only casual exploits.
app.disable('x-powered-by');

/*
*   # Prevent open redirects
*   If the user gets redirected here by some malevolant program, this middleware redirects him to the URL he was originally trying to access.
*/
/*
app.use((req, res) => {
    console.log(new Url(req.query.url).host);
    try {
        if(new Url(req.query.url).host !== process.env.METEOR_SONG_SERVER_HOST_URL) {
            return res.status(404).end(`Unsupported redirect to host: ${req.query.url}`);
        }
    } catch (err) {
        return res.status(400).end(`Invalid url: ${req.query.url}`);
    }
    res.redirect(req.query.url);
});
*/

app.use(async (req, res, next ) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        logger.error("Erreur lors de la connexion à la base de données:", err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

app.use(errorHandler);

// app.get("/", (req, res, next) => res.send(`Express on Vercel. Origin: ${req.headers.origin ? req.headers.origin : ""}`));

app.use('/ml', mlRoutes);
app.use('/classif', classifRoutes);
app.use('/colors', colorRoutes);

app.use((req, res, next) => {
    res.status(404).send("<h1>Error 404</h1>");
    next();
});

app.listen(PORT, () => {
    logger.info(`Le serveur est lancé sur le port ${PORT}.`)
});


module.exports = app;