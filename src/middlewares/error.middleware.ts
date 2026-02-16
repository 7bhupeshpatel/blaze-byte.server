import { Request, Response, NextFunction } from 'express';

/**
 * Custom Error Class to handle operational errors
 */
export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("DEBUG ERROR:", err); // This prints the real error to your terminal
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development vs Production response
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production: Don't leak sensitive error details
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or unknown errors: log them and send generic message
      console.error('ERROR 💥', err);
      res.status(500).json({
       status: 'error',
    message: err.message, // Change this to err.message temporarily to see it in Postman
    stack: err.stack      // This will tell you exactly which line failed
      });
    }
  }
};