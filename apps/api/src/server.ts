import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import scanRoutes from './routes/scan';
import botRoutes from './routes/bot';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/scan', scanRoutes);
app.use('/api/v1/bot', botRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
