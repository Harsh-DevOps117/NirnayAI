import { Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../db';
import fs from 'fs/promises';
import path from 'path';
import { scanQueue, redisConnection } from '../services/queue';

export const uploadAPK = async (req: AuthRequest, res: Response) => {
  try {
    // Determine user context (either JWT userId or Bot sender)
    let userId = req.user?.userId;
    const botToken = req.headers['x-bot-token'];
    const whatsappSender = req.headers['x-whatsapp-sender'];

    // Check if this is a bot request
    if (botToken === process.env.BOT_API_TOKEN && whatsappSender) {
      // Find or create a generic bot user
      let botUser = await prisma.user.findUnique({ where: { email: 'whatsapp-bot@system.local' } });
      if (!botUser) {
        botUser = await prisma.user.create({ data: { email: 'whatsapp-bot@system.local' } });
      }
      userId = botUser.id;
    }

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (!req.file) {
      return res.status(400).json({ message: 'No APK file provided' });
    }

    const fileBuffer = req.file.buffer;
    const filename = req.file.originalname;

    // 1. Calculate File Hash
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const fileHash = hashSum.digest('hex');

    // 2. Check Redis Cache for duplicate
    const cachedReportStr = await redisConnection.get(`apk_report:${fileHash}`);
    if (cachedReportStr) {
      console.log(`Cache hit for ${fileHash}`);
      const cachedReport = JSON.parse(cachedReportStr);
      
      // Save a record in DB instantly for this user
      const scan = await prisma.appScan.create({
        data: {
          userId,
          filename,
          fileHash,
          status: 'COMPLETED',
          finalReportJson: cachedReport
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Analysis instantly retrieved from cache',
        data: {
          id: scan.id,
          scanId: scan.id,
          cached: true,
          report: cachedReport
        }
      });
    }

    // 3. Cache Miss - Process new APK
    // Create DB Record as QUEUED
    const scan = await prisma.appScan.create({
      data: {
        userId,
        filename,
        fileHash,
        status: 'QUEUED'
      }
    });

    // Save to Local Volume
    console.log(`Saving ${filename} locally...`);
    const localFilePath = path.join('/app/uploads', `${Date.now()}_${filename.replace(/\s+/g, '_')}`);
    await fs.writeFile(localFilePath, fileBuffer);

    // Update DB with URL (repurposing cloudinaryUrl column for local path)
    await prisma.appScan.update({
      where: { id: scan.id },
      data: { cloudinaryUrl: localFilePath }
    });

    // 4. Enqueue Job for Worker
    console.log(`Enqueueing job for scan ${scan.id}...`);
    await scanQueue.add('analyze-apk', {
      scanId: scan.id,
      cloudinaryUrl: localFilePath,
      fileHash,
      filename,
      whatsappSender: typeof whatsappSender === 'string' ? whatsappSender : undefined
    });

    res.status(202).json({
      success: true,
      message: 'APK uploaded and queued for analysis successfully',
      data: {
        id: scan.id,
        scanId: scan.id,
        cached: false
      }
    });

  } catch (error) {
    console.error('Upload APK Error:', error);
    res.status(500).json({ message: 'Internal server error during upload' });
  }
};

export const getScanStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;

    const scan = await prisma.appScan.findUnique({
      where: { id }
    });

    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    if (scan.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

    res.json({
      success: true,
      data: {
        id: scan.id,
        scanId: scan.id,
        status: scan.status,
        filename: scan.filename,
        createdAt: scan.createdAt,
        finalReportJson: scan.finalReportJson
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getScanReport = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;

    const scan = await prisma.appScan.findUnique({
      where: { id }
    });

    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    if (scan.userId !== userId) return res.status(403).json({ message: 'Forbidden' });
    if (scan.status !== 'COMPLETED') return res.status(400).json({ message: `Report not ready. Status: ${scan.status}` });

    res.json({
      success: true,
      data: {
        scanId: scan.id,
        report: scan.finalReportJson
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserScans = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const scans = await prisma.appScan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        finalReportJson: true
      }
    });

    res.json({
      success: true,
      data: scans
    });
  } catch (error) {
    console.error('getUserScans Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
