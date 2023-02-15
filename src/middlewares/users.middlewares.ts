import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { iUser } from "./../interfaces/users.interfaces";

export const validateBody =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const { body: payload } = req;

    const validatedPayload = schema.parse(payload);

    req.body = validatedPayload;
  };

export const userEmailIsUnique = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
};
