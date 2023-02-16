import {
  EmailAlreadyRegistered,
  InvalidId,
  InvalidTokenError,
  PermissionError,
} from "./../error";
import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { service } from "../services/users.services";
import { verify } from "jsonwebtoken";
import { tSelectUser } from "../interfaces/users.interfaces";

export namespace middleware {
  export const userEmailIsUnique = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userEmail = String(req.body?.email);
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

  export const validateBody =
    (schema: ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { body: payload } = req;

      const validatedPayload = schema.parse(payload);

      req.body = validatedPayload;

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

        const userWithSameEmail: tSelectUser = await service.getUserDataByField(
          decoded.email,
          ["id", "name", "email", "password", "admin", "active"],
          "email"
        );

        req.user = userWithSameEmail;

        return next();
      }
    );
  };

  export const validateAdminPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const isNotAdmin = !req.user.admin;

    if (isNotAdmin) {
      throw new PermissionError("Insufficient Permission", 403);
    }

    next();
  };

  export const testIfIdExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const parsedParamId = parseInt(String(req.params.id));

    let idWasNotFound: boolean = isNaN(parsedParamId);

    if (!idWasNotFound) {
      const foundUser = await service.getUserDataByField(
        String(parsedParamId),
        ["id"],
        "id"
      );

      idWasNotFound = !foundUser;
    }

    if (idWasNotFound) {
      throw new InvalidId("User not found", 404);
    }

    req.parsedParamId = parsedParamId;

    next();
  };

  export const testIfHasSameId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const paramId = req.parsedParamId;
    const loggedUserId = req.user.id;

    const isNotAdmin = !req.user.admin;
    const hasDifferentId = paramId !== loggedUserId;

    if (isNotAdmin && hasDifferentId) {
      throw new PermissionError("Insufficient Permission", 403);
    }

    next();
  };
}
