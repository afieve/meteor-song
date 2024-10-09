import mongoose from 'mongoose';
import pino from 'pino';

const logger = pino();

let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        logger.info("Connexion à MongoDB...");
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
        } else if (process.env.MONGODB_CONNECTION_STRING) {
            await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        } else {
            throw new Error('neither MONGODB_CONNECTION_STRING or MONGODB_URI are defined in environment variables.');
        }
        isConnected = true;
        logger.info("Connecté à la base de données MongoDB.");
    } catch (err) {
        logger.error("Erreur de connexion à la base de données MongoDB:", err);
        throw err;

    }
}