import z from "zod"

export const userSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type UserResponse = z.infer<typeof userSchema>
