import { Router } from 'express';
import { getBotStatus } from '../controllers/botController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Protect this route so only authenticated dashboard users can connect the bot
router.get('/status', authenticateJWT, getBotStatus);

export default router;
