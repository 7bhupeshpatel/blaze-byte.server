import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import adminRoutes from './routes/admin.routes';
import workspaceRoutes from './routes/workspace.routes'
import staffRoutes from './routes/staff.routes';

const app: Application = express();

// 1. Global Middlewares
app.use(helmet()); // Security headers
app.use(cors());   // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON bodies

// 2. Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes); // SuperAdmin level
app.use('/api/v1/workspace', workspaceRoutes);  // Admin/Staff level
app.use('/api/v1/staff', staffRoutes);
// 3. Health Check (To see if server is alive)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// 4. Global Error Handling (Must be last)
app.use(errorHandler);

export default app;