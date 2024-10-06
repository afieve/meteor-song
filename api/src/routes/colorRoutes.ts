import express from 'express';
import pino from 'pino';
import { getHTMLColorTable } from '../services/ColorService';

const router = express.Router();
const logger = pino();

router.get('/colors', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/colors": Demande la page HTML 'colors'.`);
    const html = await getHTMLColorTable();
    res.send(html);
    
});

export default router;