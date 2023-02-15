import { createUserSchema } from "./../schemas/users.schemas";
import { Router } from "express";
import { controller } from "../controllers/users.controllers";
import { middleware } from "../middlewares/users.middlewares";

export const usersRouter: Router = Router();

usersRouter.post(
  "",
  middleware.validateBody(createUserSchema),
  middleware.userEmailIsUnique,
  controller.createUser
);
