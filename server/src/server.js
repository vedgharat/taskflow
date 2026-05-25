import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middlewares/errorMiddleware.js';

const app = express();

// --------------- Security & Parsing Middleware ---------------

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const isAllowed = 
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production';

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --------------- Routes ---------------

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client', 'dist', 'index.html'));
  });
}

// --------------- Global Error Handler (must be last) ---------------

app.use(errorHandler);

// --------------- Start Server ---------------

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
  // Connect to DB asynchronously (non-blocking)
  connectDB();
};

startServer();

export default app;
