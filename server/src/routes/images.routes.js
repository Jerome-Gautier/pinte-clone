import { Router } from 'express';

import * as imageRepo from '../repositories/imageRepo.js';
import * as favRepo from '../repositories/favRepo.js';

const router = Router();

router.get('/', async (req, res) => {
    const viewerId = req.user?.id
        ? Number(req.user.id)
        : null;

    const images = await imageRepo.getAllImages(viewerId);
    res.send(images);
});

router.get('/favorites', async (req, res) => {
    const viewerId = req.user?.id
        ? Number(req.user.id)
        : null;

    const images = await favRepo.getFavoriteImages(viewerId);
    res.send(images);
});

router.post('/', async (req, res) => {
    const user_id = req.user?.id;
    const { url, title } = req.body;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const response = await imageRepo.addImage({ user_id, url, title });
        res.status(201).json(response);
    } catch (error) {
        console.error('POST /api/images error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:user_id', async (req, res) => {
    const viewerId = req.user?.id
        ? Number(req.user.id)
        : null;

    const images = await imageRepo.getImagesByUser(req.params.user_id, viewerId);
    res.send(images);
});


router.delete('/:id', async (req, res) => {
    try {
        const imageId = Number(req.params.id);
        if (!Number.isInteger(imageId)) return res.status(400).json({ error: 'Invalid image ID'  });

        const image = await imageRepo.getImageById(imageId);
        if (!image) return res.status(404).json({ error: 'Image not found' });

        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        if (image.user_id !== userId) return res.status(403).json({ error: 'Not allowed to delete this image' });

        const success = await imageRepo.deleteImage(imageId);
        return res.status(200).json({ success });
    } catch (error) {
        console.error('DELETE /api/images/:id error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:id/favorite', async (req, res) => {
    try {
        const imageId = Number(req.params.id);
        if (!Number.isInteger(imageId)) return res.status(400).json({ error: 'Invalid image ID' });

        const userId = req.user?.id ?? (req.header('x-user-id') ? Number(req.header('x-user-id')) : null);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const currently = await favRepo.isFavorite(userId, imageId);
        const result = currently
            ? await favRepo.remove(userId, imageId)
            : await favRepo.add(userId, imageId);

        // return both the favorite_count and the boolean is_favorite
        return res.status(200).json({
            image_id: imageId,
            favorite_count: result.favorite_count ?? null,
            is_favorite: result.is_favorite ?? null
        });
    } catch (error) {
        console.error('POST /api/images/:id/favorite error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;