import { z } from "zod"

// User Management DTOs

export const UpdateProfileSchema = z.object({
  name: z
    .object({
      first: z.string().min(1, "First name is required"),
      last: z.string().min(1, "Last name is required"),
    })
    .optional(),
  email: z.string().email("Invalid email format").optional(),
})

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>

export const UpdateUserSchema = z.object({
  name: z
    .object({
      first: z.string().min(1, "First name is required"),
      last: z.string().min(1, "Last name is required"),
    })
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  role: z.enum(["user", "superadmin"]).optional(),
})

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>

export const registerUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

export const loginUserSchema = z.object({
  email: z.string().email({ message: "El email debe ser válido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
})
export type LoginUserDto = z.infer<typeof loginUserSchema>

export type RegisterUserDto = z.infer<typeof registerUserSchema>

export const sendEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
})
export type SendEmailDto = z.infer<typeof sendEmailSchema>

export const verifyEmailSchema = z.object({
  flowId: z.string().min(1, "flow id is required"),
  code: z.string().min(1, "code is required"),
})
export type verifyEmailDto = z.infer<typeof verifyEmailSchema>
