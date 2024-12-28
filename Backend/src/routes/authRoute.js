import express from 'express';
import { login, signup, logout, checkAuth, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword } from '../controllers/authController.js';
import { validateToken as protectedRoute } from '../middleware.js/validateToken.js';

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.post('/send-verify-otp', protectedRoute, sendVerifyOtp);

router.post('/verify-account', protectedRoute, verifyEmail);

router.post('/send-reset-otp', sendResetOtp);

router.post('/reset-password', resetPassword);

router.get('/check', protectedRoute, checkAuth);

export default router;