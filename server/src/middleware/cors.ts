import {Request, Response, NextFunction} from "express";

const customCorsMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigin = process.env.CLIENT_APP_ORIGIN_URL;
    const origin = req.headers.origin;
    console.log('request.headers.origin:', origin);
    if (origin && origin !== allowedOrigin) {
        return res.status(403).send("Forbidden: Invalid origin.");
    } else if (!origin) {
        return res.status(403).send("Forbidden: No origin specified.")
    }
    next();
}

export default customCorsMiddleWare;