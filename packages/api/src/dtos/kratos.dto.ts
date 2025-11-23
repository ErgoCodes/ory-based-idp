import { z } from "zod"

// ============================================
// Registration DTOs
// ============================================

export const RegisterUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

export type RegisterUser = z.infer<typeof RegisterUserSchema>

// ============================================
// Identity DTOs
// ============================================

export const IdentityTraitsSchema = z.object({
  email: z.string().email(),
  name: z
    .object({
      first: z.string(),
      last: z.string(),
    })
    .optional(),
})

export type IdentityTraits = z.infer<typeof IdentityTraitsSchema>

export const kratosIdentitySchema = z.object({
  id: z.string(),
  schema_id: z.string(),
  traits: IdentityTraitsSchema,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type Identity = z.infer<typeof kratosIdentitySchema>

// ============================================
// Session DTOs
// ============================================

export const kratosSessionSchema = z.object({
  id: z.string(),
  active: z.boolean().optional(),
  expires_at: z.string().optional(),
  authenticated_at: z.string().optional(),
  identity: kratosIdentitySchema,
})

export type Session = z.infer<typeof kratosSessionSchema>

// ============================================
// Login DTOs (renamed to avoid conflict with Hydra)
// ============================================

export const KratosLoginCredentialsSchema = z.object({
  identifier: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export type KratosLoginCredentials = z.infer<typeof KratosLoginCredentialsSchema>
