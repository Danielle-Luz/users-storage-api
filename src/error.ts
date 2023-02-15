import { Request, Response } from "express"

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    
    this.statusCode = statusCode;
  }
}

export const errorHandler = (error: Error, req: Request, res: Response) => {

}