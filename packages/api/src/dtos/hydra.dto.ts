import { z } from "zod"

// ============================================
// Login DTOs
// ============================================

export const LoginRequestInfoSchema = z.object({
  challenge: z.string(),
  skip: z.boolean(),
  subject: z.string(),
  client: z.object({
    client_id: z.string(),
    client_name: z.string(),
    logo_uri: z.string().optional(),
  }),
  requested_scope: z.array(z.string()),
  requested_access_token_audience: z.array(z.string()),
})

export type LoginRequestInfo = z.infer<typeof LoginRequestInfoSchema>

export const LoginCredentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
})

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>

export const SkipLoginSchema = z.object({
  skip: z.literal(true),
  subject: z.string().min(1, "Subject is required"),
})

export type SkipLogin = z.infer<typeof SkipLoginSchema>

export const LoginRequestSchema = z.union([LoginCredentialsSchema, SkipLoginSchema])

export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const AcceptLoginRequestSchema = z.object({
  subject: z.string(),
  remember: z.boolean().optional(),
  remember_for: z.number().optional(),
  acr: z.string().optional(),
  context: z.any().optional(),
})

export type AcceptLoginRequest = z.infer<typeof AcceptLoginRequestSchema>

// ============================================
// Consent DTOs
// ============================================

export const ConsentRequestInfoSchema = z.object({
  challenge: z.string(),
  skip: z.boolean(),
  subject: z.string(),
  client: z.object({
    client_id: z.string(),
    client_name: z.string(),
    logo_uri: z.string().optional(),
  }),
  requested_scope: z.array(z.string()),
  requested_access_token_audience: z.array(z.string()),
})

export type ConsentRequestInfo = z.infer<typeof ConsentRequestInfoSchema>

export const ConsentDecisionSchema = z.object({
  grant: z.boolean(),
  remember: z.boolean().optional(),
  grant_scope: z.array(z.string()).optional(),
})

export type ConsentDecision = z.infer<typeof ConsentDecisionSchema>

export const AcceptConsentRequestSchema = z.object({
  grant_scope: z.array(z.string()),
  grant_access_token_audience: z.array(z.string()),
  remember: z.boolean().optional(),
  remember_for: z.number().optional(),
  session: z
    .object({
      id_token: z.record(z.any()).optional(),
      access_token: z.record(z.any()).optional(),
    })
    .optional(),
})

export type AcceptConsentRequest = z.infer<typeof AcceptConsentRequestSchema>

// ============================================
// Common DTOs
// ============================================

export const RedirectResponseSchema = z.object({
  redirect_to: z.string(),
})

export type RedirectResponse = z.infer<typeof RedirectResponseSchema>

// ============================================
// OAuth2 Client DTOs
// ============================================

export const CreateOAuth2ClientSchema = z.object({
  client_name: z.string().min(1, "Client name is required"),
  redirect_uris: z
    .array(z.string().url("Invalid redirect URI"))
    .min(1, "At least one redirect URI is required"),
  post_logout_redirect_uris: z.array(z.string().url("Invalid post logout redirect URI")).optional(),
  grant_types: z.array(z.string()).min(1, "At least one grant type is required"),
  response_types: z.array(z.string()).optional(),
  scope: z.string().min(1, "Scope is required"),
  token_endpoint_auth_method: z.string().optional(),
  audience: z.array(z.string()).optional(),
  logo_uri: z.string().url().optional(),
  client_uri: z.string().url().optional(),
  policy_uri: z.string().url().optional(),
  tos_uri: z.string().url().optional(),
  contacts: z.array(z.string().email()).optional(),
  metadata: z.record(z.any()).optional(),
})

export type CreateOAuth2Client = z.infer<typeof CreateOAuth2ClientSchema>

export const OAuth2ClientSchema = z.object({
  client_id: z.string(),
  client_name: z.string().optional(),
  client_secret: z.string().optional(),
  redirect_uris: z.array(z.string()).optional(),
  post_logout_redirect_uris: z.array(z.string()).optional(),
  grant_types: z.array(z.string()).optional(),
  response_types: z.array(z.string()).optional(),
  scope: z.string().optional(),
  token_endpoint_auth_method: z.string().optional(),
  audience: z.array(z.string()).optional(),
  logo_uri: z.string().optional(),
  client_uri: z.string().optional(),
  policy_uri: z.string().optional(),
  tos_uri: z.string().optional(),
  contacts: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  created_at: z.union([z.string(), z.date()]).optional(),
  updated_at: z.union([z.string(), z.date()]).optional(),
})

export type OAuth2Client = z.infer<typeof OAuth2ClientSchema>
