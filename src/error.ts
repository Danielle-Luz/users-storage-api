import { iErrorMessage } from "./interfaces/index";
import { Request, Response } from "express";
import { ZodError } from "zod";

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
  }
}

export const errorHandler = (error: Error, req: Request, res: Response) => {
  if (error instanceof AppError) {
    const { statusCode, message } = error;

    return res.status(statusCode).send({ message });
  } else if (error instanceof ZodError) {
    return res.status(400).send({ message: error.flatten().fieldErrors });
  }

  return res.status(500).send({ message: "Internal server error" });
};
