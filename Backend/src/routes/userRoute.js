import express from 'express';
import { validateToken as protectedRoute } from '../middleware.js/validateToken.js';
import { userData } from '../controllers/userController.js';

const router = express.Router();

router.get('/data', protectedRoute, userData);

export default router;