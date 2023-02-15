import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().max(20),
  email: z.string().max(100).email(),
  password: z.string().max(120),
  admin: z.boolean(),
  active: z.boolean()
});

export const updateUserSchema = createUserSchema.partial();