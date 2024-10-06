import mongoose from "mongoose";
import { clearMeteoriteLandingsCollection, getAllMeteoriteLandings, getSingleMeteoriteByDatastroId, insertAllMeteoriteLandingsGeoJSONDataToCollection, mergeSameMeteoriteLandingDocuments } from "./src/services/MeteoriteLandingsService";
import express from 'express';
import helmet from 'helmet';
import 'dotenv/config';
import cors from 'cors';
import { generateAndInsertFullClassificationTreeInDBCollection, getFullClassificationTreeFromCollection } from "./src/services/ClassificationsService";
import pino from 'pino';
import { getHTMLColorTable } from "./src/services/ColorService";


const logger = pino();
const app = express();
const PORT: number = parseInt(process.env.SERVER_PORT);

app.use(cors({
    origin: process.env.CLIENT_APP_ORIGIN_URL
}));


app.set('view engine', 'pug');
app.use(helmet());

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


mongoose.connect(process.env.MONGODB_CONNECTION_STRING.toString());
const db = mongoose.connection;

// Connection to the MongoDB database
db.once('open', async () => {
    // console.log("Connecté à la base de données MongoDB meteor_song");
    logger.info("Serveur connecté à la base de données MongoDB meteor_song")
});

// Reduce fingerprinting: the ability for an external program to determine the software that the server uses. It doesn't prevent sophisticated attacks, only casual exploits.
app.disable('x-powered-by'); 

app.get('/', async (req, res) => {
    res.send('hello');
});
app.post('/ml', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/ml": Demande l'intégralité des données d'atterrissages de météorites.`);
    const docs = await getAllMeteoriteLandings({ geolocated: true, markersEssentials: false });
    logger.info(`getAllMeteoriteLandings(): ${docs.length} météorites récupérées dans la base de données.`);
    res.send(docs);
    logger.info(`POST "/ml": ${docs.length} météorites renvoyées à ${req.headers.origin}`);
});
app.get('/ml/get-single-example/:datastroID', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/get-single-example": Demande une météorite en particulier (EXEMPLE)`);
    const doc = await getSingleMeteoriteByDatastroId(parseInt(req.params.datastroID));
    logger.info(`getSingleMeteoriteByDatastroId(): Météorite {datastroID: ${req.params.datastroID}} récupérée dans la base de données.`);
    res.send(doc);
    logger.info(`GET "/ml/get-single-example": Météorite {datastroID: ${req.params.datastroID}} renvoyée à ${req.headers.origin}`);
});
app.post('/ml/get-single-example', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/ml/get-single-example": Demande une météorite en particulier (EXEMPLE)`);
    const doc = await getSingleMeteoriteByDatastroId(parseInt(req.body.datastroID));
    logger.info(`getSingleMeteoriteByDatastroId(): Météorite {datastroID: ${req.body.datastroID}} récupérée dans la base de données.`);
    res.send(doc);
    logger.info(`POST "/ml/get-single-example": Météorite {datastroID: ${req.body.datastroID}} renvoyée à ${req.headers.origin}`);
});
app.post('/ml/get-all', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/ml/get-all": Demande les données d'atterrissages de météorites intégrales.`);
    const docs = await getAllMeteoriteLandings({ geolocated: true, markersEssentials: false });
    logger.info(`getAllMeteoriteLandings(): ${docs.length} météorites récupérées dans la base de données.`);
    res.send(docs);
    logger.info(`POST "/ml/get-all": ${docs.length} météorites renvoyées à ${req.headers.origin}`);
});
app.post('/ml/get-markers-essentials', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/ml/get-markers-essentials": Demande les données d'atterrissages de météorites essentielles au placement des marqueurs.`);
    const docs = await getAllMeteoriteLandings({ geolocated: true, markersEssentials: true });
    logger.info(`getAllMeteoriteLandings(): ${docs.length} météorites récupérées dans la base de données.`);
    res.send(docs);
    logger.info(`POST "/ml/get-markers-essentials": ${docs.length} météorites renvoyées à ${req.headers.origin}`);
});
app.get('/ml/get-markers-essentials', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/get-markers-essentials": Demande les données d'atterrissages de météorites essentielles au placement des marqueurs.`);
    const docs = await getAllMeteoriteLandings({ geolocated: true, markersEssentials: true });
    logger.info(`getAllMeteoriteLandings(): ${docs.length} météorites récupérées dans la base de données.`);
    res.send(docs);
    logger.info(`GET "/ml/get-markers-essentials": ${docs.length} météorites renvoyées à ${req.headers.origin}`);
});
app.get('/ml/insert-all-docs', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/insert-all-docs": Demande l'insertion des données d'atterrissages du fichier GeoJSON /data/raw-data/meteorite-landings@datastro.geojson dans la collection 'meteorite_landings'.`);
    const response = await insertAllMeteoriteLandingsGeoJSONDataToCollection();
    logger.info(response.message);
    res.send(response);
});

app.get('/ml/merge-same-ml-docs', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/merge-same-ml-docs": Demande la fusion des documents représentant la même météorite.`);
    const response = await mergeSameMeteoriteLandingDocuments();
    logger.info(response.message);
    res.send(response);
});

app.get('/ml/clear-collection', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/clear-collection": Demande l'effacement de tous les documents de la collection 'meteorite_landings'.`);
    const response = await clearMeteoriteLandingsCollection();
    logger.info(`${req.headers.origin}: GET "/ml/clear-collection": ${response.message}`);
    res.send(response);
})

app.get('/classif/tree', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/classif/tree": Demande l'arbre de classification.`);
    const classifTree = await getFullClassificationTreeFromCollection();
    logger.info(`getFullClassificationTreeFromCollection(): L'arbre de classification a été récupéré avec succès.`);
    res.send(classifTree);
    logger.info(`GET "/classif/tree": Arbre de classification renvoyé avec succès à ${req.headers.origin}`);
});

app.post('/classif/tree', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/tree": Demande l'arbre de classification.`);
    const classifTree = await getFullClassificationTreeFromCollection();
    logger.info(`getFullClassificationTreeFromCollection(): L'arbre de classification a été récupéré avec succès.`);
    res.send(classifTree);
    logger.info(`POST "/classif/tree": Arbre de classification renvoyé avec succès à ${req.headers.origin}`);
});
app.get('/classif/generate-and-insert', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/generate-and-insert": Demande l'arbre de classification.`);
    const result = await generateAndInsertFullClassificationTreeInDBCollection();
    res.send(result);
});
app.post('/classif/generate-and-insert', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/generate-and-insert": Demande l'arbre de classification.`);
    const result = await generateAndInsertFullClassificationTreeInDBCollection();
    res.send(result);
});
app.get('/colors', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/colors": Demande la page HTML 'colors'.`);
    const html = await getHTMLColorTable();
    res.send(html);
    
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
    res.status(404).send("<h1>Error 404</h1>");
    next();
});

app.listen(PORT, () => {
    logger.info(`Le serveur est lancé sur le port ${PORT}.`)
})
