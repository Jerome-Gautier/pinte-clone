import { Router } from 'express';

import imageRoutes from './images.routes.js';
import userRoutes from './users.routes.js';

const router = Router();

router.use("/images", imageRoutes);
router.use("/users", userRoutes);

// debug endpoint to return authenticated user payload (if any)
router.get('/me', (req, res) => {
	if (!req.user) {
		// debug: log whether an Authorization header was received
		// eslint-disable-next-line no-console
		console.log('/api/me: no req.user; authorization header:', req.headers.authorization || null);
		return res.status(401).json({ error: 'Not authenticated' });
	}

	// eslint-disable-next-line no-console
	console.log('/api/me: authenticated user', { id: req.user.id, email: req.user.email });
	res.json({ user: req.user });
});

export default router;