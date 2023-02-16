import { z } from "zod";

export namespace schema {
  export const user = z.object({
    id: z.number(),
    name: z.string().max(20),
    email: z.string().max(100).email(),
    password: z.string().max(120),
    admin: z.boolean(),
    active: z.boolean(),
  });

  export const createUser = user.omit({ id: true, active: true });

  export const updateUser = createUser.partial().omit({ admin: true });

  export const loginData = user.pick({ email: true, password: true });
}
