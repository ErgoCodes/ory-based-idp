/**
 * OAuth2 Client types
 */

export interface OAuth2Client {
  client_id: string
  client_name: string
  client_secret?: string
  redirect_uris: string[]
  post_logout_redirect_uris?: string[]
  grant_types: string[]
  response_types: string[]
  scope: string
  token_endpoint_auth_method: string
  created_at?: string
  updated_at?: string
}

export interface CreateOAuth2ClientRequest {
  client_name: string
  redirect_uris: string[]
  post_logout_redirect_uris?: string[]
  grant_types?: string[]
  response_types?: string[]
  scope?: string
  token_endpoint_auth_method?: string
}

export interface OAuth2ClientListResponse {
  clients: OAuth2Client[]
  total: number
}
