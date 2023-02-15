import { Router } from "express";
import { controller } from "../controllers/users.controllers";

export const usersRouter: Router = Router();

usersRouter.post("", controller.createUser);
