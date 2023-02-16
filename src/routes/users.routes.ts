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

usersRouter.post(
  "/login",
  middleware.validateBody(schema.loginData),
  controller.login
);

usersRouter.patch(
  "/:id",
  middleware.validateToken,
  middleware.testIfIdExists,
  middleware.testIfHasSameId,
  middleware.validateBody(schema.updateUser),
  middleware.userEmailIsUnique,
  controller.updateUser
);

usersRouter.get(
  "",
  middleware.validateToken,
  middleware.validateAdminPermission,
  controller.getAllUsers
);

usersRouter.get(
  "/profile",
  middleware.validateToken,
  controller.getLoggedUserProfile
);

usersRouter.delete(
  "/:id",
  middleware.validateToken,
  middleware.testIfIdExists,
  middleware.testIfHasSameId,
  controller.deleteUser
);

usersRouter.put(
  "/:id/recover",
  middleware.validateToken,
  middleware.validateAdminPermission,
  middleware.testIfIdExists,
  controller.recoverUser
);
