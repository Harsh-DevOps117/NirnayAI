import { Router } from 'express';
import { register, login, refresh, logout, googleLogin } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/google', googleLogin);

export default router;
