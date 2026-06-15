import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' }); // Short-lived access token
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId, jti: crypto.randomUUID() }, JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Long-lived refresh token
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string, jti: string };
};
