import { EmailAlreadyRegistered, InvalidTokenError } from "./../error";
import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { service } from "../services/users.services";
import { verify } from "jsonwebtoken";

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
    const userData = await service.getUserDataByField(
      userEmail,
      ["id"],
      "email"
    );

    if (userData?.id) {
      throw new EmailAlreadyRegistered("E-mail already registered", 409);
    }

    next();
  };

  export const validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const tokenWithBearer = req.headers?.authorization;

    const tokenWasNotSent = !tokenWithBearer;

    if (tokenWasNotSent) {
      throw new InvalidTokenError("Missing Bearer Token", 401);
    }

    const token = String(tokenWithBearer).split(" ")[1];

    return verify(
      token,
      String(process.env.SECRET_KEY),
      async (error: any, decoded: any) => {
        if (error) {
          throw new InvalidTokenError(error.message, 401);
        }

        const userWithSameEmail = await service.getUserDataByField(
          decoded.email,
          ["email", "password"],
          "email"
        );

        req.user = userWithSameEmail;

        return next();
      }
    );
  };
}
