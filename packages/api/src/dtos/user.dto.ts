import z from "zod"
import { kratosIdentitySchema, kratosSessionSchema } from "./kratos.dto"

// Schema para registro de usuario
export const registerUserSchema = z.object({
  email: z.string().email({ message: "El email debe ser válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(100, { message: "La contraseña no puede exceder 100 caracteres" }),
  firstName: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(50, { message: "El nombre no puede exceder 50 caracteres" }),
  lastName: z
    .string()
    .min(1, { message: "El apellido es requerido" })
    .max(50, { message: "El apellido no puede exceder 50 caracteres" }),
})

// Schema para respuesta de registro
export const registrationResponseSchema = z.object({
  success: z.boolean(),
  identity: kratosIdentitySchema,
  session: kratosSessionSchema.optional(),
})

export type RegisterUserDto = z.infer<typeof registerUserSchema>
export type RegistrationResponse = z.infer<typeof registrationResponseSchema>
