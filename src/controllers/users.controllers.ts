import { Request, Response } from "express";
import { tCreateUser } from "../interfaces/users.interfaces";
import { service } from "../services/users.services";

export namespace controller {
  export const createUser = async (req: Request, res: Response) => {
    const newUser: tCreateUser = req.body;

    const createdUser = await service.createUser(newUser);

    return res.status(201).send(createdUser);
  };
}
