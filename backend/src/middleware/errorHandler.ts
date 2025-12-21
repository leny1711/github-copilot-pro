import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error',
  });
};
