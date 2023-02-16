import { z } from "zod";

export namespace schema {
  export const createUser = z.object({
    name: z.string().max(20),
    email: z.string().max(100).email(),
    password: z.string().max(120),
    admin: z.boolean(),
    active: z.boolean(),
  });

  export const updateUser = createUser.partial();

  export const loginData = createUser.pick({ email: true, password: true });
}
