import { Router } from "express";
import multer from "multer";
import {
  uploadAPK,
  getScanStatus,
  getScanReport,
  getUserScans,
} from "../controllers/scanController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

router.post("/bot-upload", upload.single("apk"), uploadAPK);

router.use(authenticateJWT);

router.post("/upload", upload.single("apk"), uploadAPK);
router.get("/scans", getUserScans);
router.get("/status/:id", getScanStatus);
router.get("/report/:id", getScanReport);

export default router;
