import express from 'express';
import pino from 'pino';

const router = express.Router();
const logger = pino();

router.get('/colors', async (req, res) => {
    logger.info(`${req.headers.origin}: GET "/colors": Demande la page HTML 'colors'.`);
    res.send('colors are not a feature yet');
    
});

export default router;