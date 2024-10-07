import mongoose from 'mongoose';
import pino from 'pino';

const logger = pino();

let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    if (!process.env.MONGODB_CONNECTION_STRING) {
        throw new Error('MONGODB_CONNECTION_STRING is not defined in environment variables');
    }

    try {
        logger.info("Connexion à MongoDB...");
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        isConnected = true;
        logger.info("Connecté à la base de données MongoDB.");
    } catch (err) {
        logger.error("Erreur de connexion à MongoDB:", err);
        throw err;

    }
}