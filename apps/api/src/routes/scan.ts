import { Router } from 'express';
import multer from 'multer';
import { uploadAPK, getScanStatus, getScanReport, getUserScans } from '../controllers/scanController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB limit
  }
});

// Bot upload route (bypasses JWT, uses bot API token)
router.post('/bot-upload', upload.single('apk'), uploadAPK);

// All subsequent routes require authentication
router.use(authenticateJWT);

router.post('/upload', upload.single('apk'), uploadAPK);
router.get('/scans', getUserScans);
router.get('/status/:id', getScanStatus);
router.get('/report/:id', getScanReport);

export default router;
