import { Queue } from "bullmq";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisConnection.on("error", (error) => {
  console.error("Redis Connection Error:", error.message);
});

export const scanQueue = new Queue("apk-scan-queue", {
  connection: redisConnection as any,
});
