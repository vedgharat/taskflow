import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middlewares/errorMiddleware.js';

const app = express();

// --------------- Security & Parsing Middleware ---------------

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

// --------------- Global Error Handler (must be last) ---------------

app.use(errorHandler);

// --------------- Start Server ---------------

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

startServer();

export default app;
