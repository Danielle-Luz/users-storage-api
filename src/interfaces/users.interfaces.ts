import { z } from "zod";
import { schema } from "../schemas/users.schemas";

export type tCreateUser = z.infer<typeof schema.createUser>;
export type tUpdateUser = z.infer<typeof schema.updateUser>;
export type tLoginData = z.infer<typeof schema.loginData>;

export interface iId {
  id: number | null;
}
