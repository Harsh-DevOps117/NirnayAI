import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { uploadToMobSF, performStaticAnalysis, performDynamicAnalysis } from './services/mobsf';
import { analyzeMobSFReport } from './services/ai';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisConnection = new Redis(redisUrl, { maxRetriesPerRequest: null });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const processApkJob = async (job: Job) => {
  const { scanId, cloudinaryUrl, fileHash, filename } = job.data;
  const tempFilePath = path.join('/tmp', `${Date.now()}_${filename}`);

  try {
    console.log(`[Worker] Starting job for scan ${scanId}`);

    // 1. Read APK from shared local volume
    console.log(`[Worker] Reading APK from local volume: ${cloudinaryUrl}`);
    const fileBuffer = await fs.readFile(cloudinaryUrl);

    // 2. Upload to MobSF
    console.log(`[Worker] Uploading to MobSF...`);
    const mobsfHash = await uploadToMobSF(fileBuffer, filename);
    await prisma.appScan.update({
      where: { id: scanId },
      data: { status: 'STATIC_SCANNING', mobsfHash }
    });

    // 3. Static Analysis
    console.log(`[Worker] Performing Static Analysis...`);
    const staticReport = await performStaticAnalysis(mobsfHash);

    // 4. Dynamic Analysis
    console.log(`[Worker] Performing Dynamic Analysis...`);
    await prisma.appScan.update({
      where: { id: scanId },
      data: { status: 'DYNAMIC_SCANNING' }
    });
    
    // Attempt dynamic analysis. This might fail if the sandbox is broken.
    let dynamicReport = null;
    try {
      dynamicReport = await performDynamicAnalysis(mobsfHash);
    } catch (e) {
      console.warn(`[Worker] Dynamic analysis failed for ${mobsfHash}, falling back to static analysis only.`);
    }

    // 5. AI Summarization
    console.log(`[Worker] Generating AI Risk Report...`);
    await prisma.appScan.update({
      where: { id: scanId },
      data: { status: 'AI_ANALYZING' }
    });

    const aiReport = await analyzeMobSFReport(staticReport, dynamicReport);

    // 6. Save Final Report to DB and Cache
    console.log(`[Worker] Analysis complete. Saving results...`);
    await prisma.appScan.update({
      where: { id: scanId },
      data: { 
        status: 'COMPLETED',
        finalReportJson: aiReport 
      }
    });

    // Save to Redis Cache (1 week expiry)
    await redisConnection.setex(`apk_report:${fileHash}`, 7 * 24 * 60 * 60, JSON.stringify(aiReport));

    // Notify WhatsApp bot if sender is present
    if (job.data.whatsappSender) {
      await redisConnection.publish('scan_completed', JSON.stringify({
        scanId,
        sender: job.data.whatsappSender,
        report: aiReport
      }));
    }

    console.log(`[Worker] Job ${scanId} completed successfully!`);

  } catch (error) {
    console.error(`[Worker] Job ${scanId} failed:`, error);
    await prisma.appScan.update({
      where: { id: scanId },
      data: { status: 'FAILED' }
    });
  } finally {
    // 7. Cleanup temp file
    try {
      await fs.unlink(cloudinaryUrl);
    } catch (e) {
      console.warn(`[Worker] Failed to delete temp file ${cloudinaryUrl}`);
    }
  }
};

const worker = new Worker('apk-scan-queue', processApkJob, { 
  connection: redisConnection as any,
  concurrency: 1 // Only 1 android sandbox running to save RAM
});

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});

console.log('Worker listening for jobs...');
