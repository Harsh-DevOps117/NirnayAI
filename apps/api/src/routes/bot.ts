import { Router } from "express";
import { getBotStatus } from "../controllers/botController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/status", authenticateJWT, getBotStatus);

export default router;
