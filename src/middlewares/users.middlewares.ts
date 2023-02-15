import { NextFunction, Request, Response } from "express";
import { iUser } from "./../interfaces/users.interfaces";

const userModel: iUser = {
  id: 0,
  name: "",
  email: "",
  password: "",
  admin: false,
  active: false,
};

const userModelKeys: string[] = Object.keys(userModel);

export const userKeysAreValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body: payload } = req;
  const payloadKeys: string[] = Object.keys(payload);
};

export const userEmailIsUnique = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
