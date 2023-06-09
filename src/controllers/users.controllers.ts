import { Request, Response } from "express";
import {
  iStatus,
  tCreateUser,
  tSelectUser,
  tUser,
} from "../interfaces/users.interfaces";
import { service } from "../services/users.services";

export namespace controller {
  export const createUser = async (req: Request, res: Response) => {
    const newUser: tCreateUser = req.body;

    const createdUser = await service.createUser(newUser);

    return res.status(201).send(createdUser);
  };

  export const updateUser = async (req: Request, res: Response) => {
    const updatedUserData = req.body;
    const updatedUserId = req.parsedParamId;

    const updatedUser = await service.updateUser(
      updatedUserData,
      updatedUserId
    );

    return res.status(200).send(updatedUser);
  };

  export const getAllUsers = async (req: Request, res: Response) => {
    const allUsers: tSelectUser[] = await service.getAllUsers();

    return res.status(200).send(allUsers);
  };

  export const getLoggedUserProfile = async (req: Request, res: Response) => {
    const loggedUser = req.user;

    return res.status(200).send(loggedUser);
  };

  export const login = async (req: Request, res: Response) => {
    const loginData = req.body;

    const loggedUser = await service.login(loginData);

    return res.status(200).send(loggedUser);
  };

  export const deleteUser = async (req: Request, res: Response) => {
    const deletedUserId = req.parsedParamId;
    const inactiveStatus: iStatus = { active: false };

    await service.updateUser(inactiveStatus, deletedUserId);

    return res.status(204).send();
  };

  export const recoverUser = async (req: Request, res: Response) => {
    const recoveredUserId = req.parsedParamId;

    const recoveredUser = await service.recoverUser(recoveredUserId);

    return res.status(200).send(recoveredUser);
  };
}
