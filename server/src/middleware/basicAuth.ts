import { Request, Response, NextFunction } from "express";
import pino from "pino";
import bcrypt from "bcrypt";

const logger = pino();


if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be defined in environment variables.');
}


const basicAuth = async (req:Request, res:Response, next:NextFunction) => {

    // Récupérer l'en-tête Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Authentication required.');
    }

    // Décoder les identifiants
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    logger.info({
        base64Credentials: base64Credentials,
        credentials: credentials,
        username: username,
        password: password
    });

    const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    // Vérifier les identifiants
    if (isPasswordValid) {
        return next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('Invalid credentials.');
    }
}

export default basicAuth;