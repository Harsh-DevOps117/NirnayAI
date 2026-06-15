import { Request, Response } from 'express';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

export const getBotStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const qr = await redis.get('whatsapp_qr');
    const status = await redis.get('whatsapp_status') || 'disconnected';

    res.json({
      success: true,
      data: {
        qr,
        status
      }
    });
  } catch (error) {
    console.error('Error fetching bot status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
