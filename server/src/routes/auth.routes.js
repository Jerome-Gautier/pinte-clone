import express from 'express';
import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as userRepo from '../repositories/userRepo.js';

dotenv.config();

const router = express.Router();

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userRepo.findByGithubId(profile.id);
        if (!user) {
            user = await userRepo.createFromGithubProfile(profile);
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

router.get('/auth/github', passport.authenticate('github', { session: false }));

router.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}`, session: false }),
    (req, res) => {
        const payload = { id: req.user.id, username: req.user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        const redirectTo = `${process.env.FRONTEND_URL}/auth/success?token=${token}`;
        res.redirect(redirectTo);
    }
);

export default router;