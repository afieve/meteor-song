import express from 'express';
import pino from 'pino';
import { generateAndInsertFullClassificationTreeInDBCollection, getFullClassificationTreeFromCollection } from '../services/ClassificationsService';

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
router.get('/generate-and-insert', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/generate-and-insert": Demande l'arbre de classification.`);
    const result = await generateAndInsertFullClassificationTreeInDBCollection();
    res.send(result);
});
router.post('/generate-and-insert', async (req, res) => {
    logger.info(`${req.headers.origin}: POST "/classif/generate-and-insert": Demande l'arbre de classification.`);
    const result = await generateAndInsertFullClassificationTreeInDBCollection();
    res.send(result);
});

export default router;
