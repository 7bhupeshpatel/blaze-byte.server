import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// 1. Global Middlewares
app.use(helmet()); // Security headers
app.use(cors());   // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON bodies

// 2. Routes
app.use('/api/v1/auth', authRoutes);

// 3. Health Check (To see if server is alive)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// 4. Global Error Handling (Must be last)
app.use(errorHandler);

export default app;