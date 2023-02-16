import { Request, Response } from "express";
import { tCreateUser, tSelectUser } from "../interfaces/users.interfaces";
import { service } from "../services/users.services";

export namespace controller {
  export const createUser = async (req: Request, res: Response) => {
    const newUser: tCreateUser = req.body;

    const createdUser = await service.createUser(newUser);

    return res.status(201).send(createdUser);
  };

  export const login = async (req: Request, res: Response) => {
    const loginData = req.body;

    const loggedUser = await service.login(loginData);

    return res.status(200).send(loggedUser);
  };

  export const getAllUsers = async (req: Request, res: Response) => {
    const allUsers: tSelectUser[] = await service.getAllUsers();

    return res.status(200).send(allUsers);
  };
}
