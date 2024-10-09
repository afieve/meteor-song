import express from 'express';
import pino from 'pino';
import { generateAndInsertFullClassificationTreeInDBCollection, getFullClassificationTreeFromCollection, getSingleClassificationFromRecclass } from '../services/ClassificationsService';
import authLimiter from '../middleware/authLimiter';
import basicAuth from '../middleware/basicAuth';

const router = express.Router();
const logger = pino();

router.get('/tree', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/classif/tree": Demande l'arbre de classification.`);
    const classifTree = await getFullClassificationTreeFromCollection();
    logger.info(`getFullClassificationTreeFromCollection(): L'arbre de classification a été récupéré avec succès.`);
    res.send(classifTree);
    logger.info(`GET "/classif/tree": Arbre de classification renvoyé avec succès à ${req.headers.origin}`);
});
router.post('/tree', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/tree": Demande l'arbre de classification.`);
    const classifTree = await getFullClassificationTreeFromCollection();
    logger.info(`getFullClassificationTreeFromCollection(): L'arbre de classification a été récupéré avec succès.`);
    res.send(classifTree);
    logger.info(`POST "/classif/tree": Arbre de classification renvoyé avec succès à ${req.headers.origin}`);
});
router.post('/get-single', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/get-single": Demande les données d'une classification : ${req.body.recclass}`);
    const classif = await getSingleClassificationFromRecclass(req.body.recclass);
    logger.info(`getSingleClassificationFromRecclass(): La classification a été récupérée avec succès.`);
    if (classif) {
        res.status(200).json(classif);
    } else {
        res.status(200).json(null);
    }
    logger.info(`POST "/classif/get-single": Classification renvoyée avec succès à ${req.headers.origin}`);
});

router.get('/generate-and-insert', authLimiter, basicAuth, async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/generate-and-insert": Demande l'arbre de classification.`);
    const result = await generateAndInsertFullClassificationTreeInDBCollection();
    res.send(result);
});
router.post('/generate-and-insert', authLimiter, basicAuth, async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/generate-and-insert": Demande l'arbre de classification.`);
    const result = await generateAndInsertFullClassificationTreeInDBCollection();
    res.send(result);
});

export default router;
