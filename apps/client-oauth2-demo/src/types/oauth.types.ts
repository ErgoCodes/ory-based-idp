/**
 * OAuth2 and Hydra related type definitions
 */

/**
 * Hydra OAuth2 user profile structure
 */
export interface HydraProfile {
  sub: string
  name?: string
  email?: string
  email_verified?: boolean
  given_name?: string
  family_name?: string
}

/**
 * OAuth2 token response from Hydra
 */
export interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  token_type: string
  id_token?: string
  scope?: string
}

/**
 * User information response from userinfo endpoint
 */
export interface UserInfoResponse {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  given_name?: string
  family_name?: string
}
