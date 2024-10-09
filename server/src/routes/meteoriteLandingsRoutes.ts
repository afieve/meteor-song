import express from 'express';
import pino from 'pino';
import { clearMeteoriteLandingsCollection, getAllMeteoriteLandings, getSingleMeteoriteByDatastroId, insertAllMeteoriteLandingsGeoJSONDataToCollection, mergeSameMeteoriteLandingDocuments } from '../services/MeteoriteLandingsService';
import basicAuth from '../middleware/basicAuth';
import authLimiter from '../middleware/authLimiter';

const router = express.Router();
const logger = pino();

//~ Test de route sécurisée
router.get('/security-test', authLimiter, basicAuth, async (req, res) => {
    logger.info('GET /ml/security-test: Tentative de connexion');
    try {
        res.status(200).json({ data: "This is a secured data." })
    } catch (err) {
        res.status(500).json({ err: 'Internal Server Error' });
    }
});
router.get('/security-test-2', authLimiter, basicAuth, async (req, res) => {
    logger.info('GET /ml/security-test-2: Tentative de connexion');
    try {
        res.status(200).json({ data: "This is a secured data." })
    } catch (err) {
        res.status(500).json({ err: 'Internal Server Error' });
    }
});
router.post('/security-test', authLimiter, basicAuth, async (req, res) => {
    logger.info('POST /ml/security-test-2: Tentative de connexion');
    try {
        res.status(200).json({ data: "This is a secured data." })
    } catch (err) {
        res.status(500).json({ err: 'Internal Server Error' });
    }
});
router.post('/', async (req, res) => {
    try {
        logger.info(`${req.headers.origin}: POST "/ml": Demande l'intégralité des données d'atterrissages de météorites.`);
        const docs = await getAllMeteoriteLandings({ geolocated: true, markersEssentials: false });
        logger.info(`getAllMeteoriteLandings(): ${docs.length} météorites récupérées dans la base de données.`);
        res.status(200).json(docs);
        logger.info(`POST "/ml": ${docs.length} météorites renvoyées à ${req.headers.origin}`);
    } catch (err) {
        logger.error("Erreur sur la route /ml:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/get-single-example/:datastroID', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/get-single-example": Demande une météorite en particulier (EXEMPLE)`);
    const doc = await getSingleMeteoriteByDatastroId(parseInt(req.params.datastroID));
    logger.info(`getSingleMeteoriteByDatastroId(): Météorite {datastroID: ${req.params.datastroID}} récupérée dans la base de données.`);
    res.send(doc);
    logger.info(`GET "/ml/get-single-example": Météorite {datastroID: ${req.params.datastroID}} renvoyée à ${req.headers.origin}`);
});
router.post('/get-single-example', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/ml/get-single-example": Demande une météorite en particulier (EXEMPLE)`);
    const doc = await getSingleMeteoriteByDatastroId(parseInt(req.body.datastroID));
    logger.info(`getSingleMeteoriteByDatastroId(): Météorite {datastroID: ${req.body.datastroID}} récupérée dans la base de données.`);
    res.send(doc);
    logger.info(`POST "/ml/get-single-example": Météorite {datastroID: ${req.body.datastroID}} renvoyée à ${req.headers.origin}`);
});
router.post('/get-all', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/ml/get-all": Demande les données d'atterrissages de météorites intégrales.`);
    const docs = await getAllMeteoriteLandings({ geolocated: true, markersEssentials: false });
    logger.info(`getAllMeteoriteLandings(): ${docs.length} météorites récupérées dans la base de données.`);
    res.send(docs);
    logger.info(`POST "/ml/get-all": ${docs.length} météorites renvoyées à ${req.headers.origin}`);
});
router.post('/get-markers-essentials', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/ml/get-markers-essentials": Demande les données d'atterrissages de météorites essentielles au placement des marqueurs.`);
    const docs = await getAllMeteoriteLandings({ geolocated: true, markersEssentials: true });
    logger.info(`getAllMeteoriteLandings(): ${docs.length} météorites récupérées dans la base de données.`);
    res.send(docs);
    logger.info(`POST "/ml/get-markers-essentials": ${docs.length} météorites renvoyées à ${req.headers.origin}`);
});
router.get('/get-markers-essentials', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/get-markers-essentials": Demande les données d'atterrissages de météorites essentielles au placement des marqueurs.`);
    const docs = await getAllMeteoriteLandings({ geolocated: true, markersEssentials: true });
    logger.info(`getAllMeteoriteLandings(): ${docs.length} météorites récupérées dans la base de données.`);
    res.send(docs);
    logger.info(`GET "/ml/get-markers-essentials": ${docs.length} météorites renvoyées à ${req.headers.origin}`);
});
router.get('/insert-all-docs', authLimiter, basicAuth, async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/insert-all-docs": Demande l'insertion des données d'atterrissages du fichier GeoJSON /data/raw-data/meteorite-landings@datastro.geojson dans la collection 'meteorite_landings'.`);
    const response = await insertAllMeteoriteLandingsGeoJSONDataToCollection();
    logger.info(response.message);
    res.send(response);
});

router.get('/merge-same-ml-docs', authLimiter, basicAuth, async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/merge-same-ml-docs": Demande la fusion des documents représentant la même météorite.`);
    const response = await mergeSameMeteoriteLandingDocuments();
    logger.info(response.message);
    res.send(response);
});

router.get('/clear-collection', authLimiter, basicAuth, async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/ml/clear-collection": Demande l'effacement de tous les documents de la collection 'meteorite_landings'.`);
    const response = await clearMeteoriteLandingsCollection();
    logger.info(`${req.headers.origin}: GET "/ml/clear-collection": ${response.message}`);
    res.send(response);
});

export default router;