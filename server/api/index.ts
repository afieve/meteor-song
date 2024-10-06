import mongoose from "mongoose";
import express from 'express';
import helmet from 'helmet';
import 'dotenv/config';
import cors from 'cors';
import pino from 'pino';
import serverless from "serverless-http";

import mlRoutes from "../src/routes/meteoriteLandingsRoutes";
import classifRoutes from "../src/routes/classificationsRoutes";
import colorRoutes from "../src/routes/colorRoutes";


const logger = pino();
const app = express();
const PORT: number = parseInt(process.env.SERVER_PORT);


app.use(cors({
    origin: process.env.CLIENT_APP_ORIGIN_URL
}));


// app.set('view engine', 'pug');
app.use(helmet());
app.use(express.json()); // Pour parser le JSON dans les requêtes

// Middleware CORS custom

app.use((req, res, next) => {
    const allowedOrigin = process.env.CLIENT_APP_ORIGIN_URL;
    const origin = req.headers.origin;
    console.log('request.headers.origin:', origin);
    if (origin && origin !== allowedOrigin) {
        return res.status(403).send("Forbidden: Invalid origin.");
    } else if (!origin) {
        return res.status(403).send("Forbidden: No origin specified.")
    }
    next();

});


// app.use( (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", process.env.CLIENT_APP_ORIGIN_URL);
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// Connexion à MongoDB
let isConnected: boolean = false;
const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING.toString());
        isConnected = true;
        logger.info("Serveur connecté à la base de données MongoDB meteor_song")
    } catch (err) {
        logger.error("Erreur de connexion à MongoDB:", err);
    }
}
connectToDatabase();


// mongoose.connect(process.env.MONGODB_CONNECTION_STRING.toString());
// const db = mongoose.connection;

// Connection to the MongoDB database
// db.once('open', async () => {
//     // console.log("Connecté à la base de données MongoDB meteor_song");
//     logger.info("Serveur connecté à la base de données MongoDB meteor_song")
// });


// Reduce fingerprinting: the ability for an external program to determine the software that the server uses. It doesn't prevent sophisticated attacks, only casual exploits.
app.disable('x-powered-by');

app.get("/", (req, res, next) => res.send(`Express on Vercel. Origin: ${req.headers.origin ? req.headers.origin : ""}`));

app.use('/ml', mlRoutes);
app.use('/classif', classifRoutes);
app.use('/colors', colorRoutes);


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

app.use((req, res, next) => {
    res.status(404).send("<h1>Error 404</h1>");
    next();
});

app.listen(PORT, () => {
    logger.info(`Le serveur est lancé sur le port ${PORT}.`)
})

export const handler = serverless(app);