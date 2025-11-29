import z from "zod"

export const loginUserSchema = z.object({
  email: z.string().email({ message: "El email debe ser válido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
})
export type LoginUserDto = z.infer<typeof loginUserSchema>
