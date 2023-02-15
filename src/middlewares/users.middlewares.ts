import { EmailAlreadyRegistered } from "./../error";
import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { iUser } from "./../interfaces/users.interfaces";
import { service } from "../services/users.services";

export namespace middleware {
  export const validateBody =
    (schema: ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { body: payload } = req;

      const validatedPayload = schema.parse(payload);

      req.body = validatedPayload;

      next();
    };

  export const userEmailIsUnique = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userEmail = req.body.email;
    const userData = await service.getUserIdByEmail(userEmail);

    if (userData?.id) {
      throw new EmailAlreadyRegistered("E-mail already registered", 409);
    }

    next();
  };
}
