import { iErrorMessage } from './interfaces/index';
import { Request, Response } from "express"

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    
    this.statusCode = statusCode;
  }
}

export const errorHandler = (error: Error, req: Request, res: Response) => {
  const errorMessage: iErrorMessage = {
    statusCode: 500,
    message: "Internal server error"
  }

  if (error instanceof AppError) {
    const { statusCode, message } = error;

    errorMessage.statusCode = statusCode;
    errorMessage.message = message;

    return res.status(statusCode).send(errorMessage);
  }

  return res.status(500).send(errorMessage);
}