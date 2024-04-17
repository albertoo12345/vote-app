import * as z from "zod"

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
