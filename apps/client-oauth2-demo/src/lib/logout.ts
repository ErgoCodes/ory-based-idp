/**
 * OIDC Logout utilities
 * Implements the RP-Initiated Logout flow according to OIDC spec
 */

/**
 * Initiate OIDC logout flow
 * This will redirect to Hydra's logout endpoint, which will then redirect to the logout UI
 *
 * @param idToken - The ID token received during login (optional but recommended)
 * @param postLogoutRedirectUri - Where to redirect after logout (optional)
 */
export function initiateOIDCLogout(idToken?: string, postLogoutRedirectUri?: string): void {
  const hydraPublicUrl =
    process.env.NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT?.replace("/oauth2/auth", "") ||
    "http://localhost:4444"

  const logoutEndpoint = `${hydraPublicUrl}/oauth2/sessions/logout`

  // Build logout URL with optional parameters
  const params = new URLSearchParams()

  if (idToken) {
    params.set("id_token_hint", idToken)
  }

  if (postLogoutRedirectUri) {
    params.set("post_logout_redirect_uri", postLogoutRedirectUri)
  }

  const logoutUrl = `${logoutEndpoint}?${params.toString()}`

  console.log("Initiating OIDC logout:", logoutUrl)

  // Redirect to Hydra's logout endpoint
  window.location.href = logoutUrl
}

/**
 * Clear local session data
 * This should be called after successful logout or when tokens are invalid
 */
export function clearLocalSession(): void {
  sessionStorage.removeItem("access_token")
  sessionStorage.removeItem("refresh_token")
  sessionStorage.removeItem("user_claims")
  sessionStorage.removeItem("id_token")
  sessionStorage.removeItem("pkce_code_verifier")
  sessionStorage.removeItem("oauth2_state")
}

/**
 * Perform complete logout
 * Combines OIDC logout with local session cleanup
 */
export function performCompleteLogout(postLogoutRedirectUri?: string): void {
  // Get ID token from session storage
  const idToken = sessionStorage.getItem("id_token") || undefined

  console.log("Performing logout with:", {
    hasIdToken: !!idToken,
    postLogoutRedirectUri,
  })

  // Clear local session first
  clearLocalSession()

  // Initiate OIDC logout flow
  initiateOIDCLogout(idToken, postLogoutRedirectUri)
}
