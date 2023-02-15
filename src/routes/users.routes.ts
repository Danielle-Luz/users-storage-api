import { schema } from "./../schemas/users.schemas";
import { Router } from "express";
import { controller } from "../controllers/users.controllers";
import { middleware } from "../middlewares/users.middlewares";

export const usersRouter: Router = Router();

usersRouter.post(
  "",
  middleware.validateBody(schema.createUser),
  middleware.userEmailIsUnique,
  controller.createUser
);
