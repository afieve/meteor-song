import rateLimit from 'express-rate-limit';

// Définir la limite des tentatives d'authentification par IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite chaque IP à 5 requêtes par fenêtre
    message: "Trop de tentatives de connexions depuis cette IP. Veuillez réessayer dans 15 minutes.",
    headers: true,
    standardHeaders: true, // Retourne les informations de limite dans les en-têtes RateLimit-
    legacyHeaders: false, // Désactive les en-têtes X-RateLimit-
});

export default authLimiter;