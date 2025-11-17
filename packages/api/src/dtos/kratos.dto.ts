import z from "zod"

// Schema para traits de usuario (estructura de Kratos)
export const userTraitsSchema = z.object({
  email: z.string().email(),
  name: z.object({
    first: z.string(),
    last: z.string(),
  }),
})

// Schema para identidad de Kratos
export const kratosIdentitySchema = z.object({
  id: z.string(),
  schema_id: z.string(),
  traits: userTraitsSchema,
  created_at: z.string(),
  updated_at: z.string(),
})

// Schema para sesión de Kratos
export const kratosSessionSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  expires_at: z.string(),
  authenticated_at: z.string(),
})

export type UserTraits = z.infer<typeof userTraitsSchema>
export type KratosIdentity = z.infer<typeof kratosIdentitySchema>
export type KratosSession = z.infer<typeof kratosSessionSchema>
