import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import "express-async-errors";

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
  }
}

export class EmailAlreadyRegistered extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export class InvalidLoginDataError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export class InactiveUserError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export class PermissionError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);

  if (error instanceof AppError) {
    const { statusCode, message } = error;

    return res.status(statusCode).send({ message });
  } else if (error instanceof ZodError) {
    return res.status(400).send(error.flatten().fieldErrors);
  }

  return res.status(500).send({ message: "Internal server error" });
};
