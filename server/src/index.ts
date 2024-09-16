import mongoose from "mongoose";
import { getAllMeteoriteLandings } from "./services/MeteoriteLandingsService";
// import Url from 'express';
import * as express from 'express';
import helmet from 'helmet';
import 'dotenv/config';
import * as cors from 'cors';

// const express = require('express');
const app = express();

const PORT: number = parseInt(process.env.SERVER_PORT);

app.use(cors({"origin": process.env.CLIENT_APP_ORIGIN_URL}));
app.use(helmet());




mongoose.connect(process.env.MONGODB_CONNECTION_STRING.toString());
const db = mongoose.connection;

// Connection to the MongoDB database
db.once('open', async () => {
    console.log("Connecté à la base de données MongoDB meteor_song");
    // teste la création et la suppression d'un document pour meteorite_landings 
});

app.disable('x-powered-by'); // reduce fingerprinting: the ability for an external program to determine the software that the server uses. It doesn't prevent sophisticated attacks, only casual exploits.

app.post('/ml', async (req, res) => {
    // console.log({ req: req, res: res });
    const docs = await getAllMeteoriteLandings({ geolocated: true });
    console.log(docs.length, 'météorites récupérés dans la base de données.');
    res.send(docs);
});


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
    // console.log({ req: req, res: res, next: next });
    res.status(404).send("<h1>Error 404</h1>");
});

app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port ${PORT}.`)
})