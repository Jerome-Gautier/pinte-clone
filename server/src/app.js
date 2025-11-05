import express from 'express';
import cors from 'cors';
import passport from 'passport';

import routes from './routes/index.js';
import authRoutes from './routes/auth.routes.js';
import { jwtOptional } from './middlewares/jwt.middleware.js';

const app = express();

// enable CORS and explicitly allow Authorization header so the browser can send the Bearer token
app.use(
	cors({
		origin: true, // reflect request origin - fine for development
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
		credentials: true,
		optionsSuccessStatus: 200,
	})
);
app.use(express.json());
app.use(passport.initialize());

app.use(jwtOptional);
app.use(authRoutes);

app.use('/api', routes);

export default app;