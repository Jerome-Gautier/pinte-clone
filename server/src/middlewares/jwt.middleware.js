import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function jwtOptional(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : (req.query.token || null);

    if (!token) {
        return next();
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
    } catch (err) {
        console.warn('jwt.middleware: invalid JWT', err && err.message);
    }

    next();
}