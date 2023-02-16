import { z } from "zod";
import { schema } from "../schemas/users.schemas";

export type tUser = z.infer<typeof schema.user>;
export type tCreateUser = z.infer<typeof schema.createUser>;
export type tUpdateUser = z.infer<typeof schema.updateUser>;
export type tLoginData = z.infer<typeof schema.loginData>;
export type tSelectUser = Omit<tUser, "password">;

export interface iStatus {
  active: boolean;
  [key: string]: boolean;
}

export interface iId {
  id: number | null;
}
