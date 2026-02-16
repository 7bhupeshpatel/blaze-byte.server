import app from './app';
import prisma from './config/db.config';

const PORT = process.env.PORT || 6969;

async function bootstrap() {
  try {
    // Test DB connection on startup
    await prisma.$connect();
    console.log('Successfully connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();