/**
 * PKCE (Proof Key for Code Exchange) utility functions
 * Used for OAuth2 authorization code flow with PKCE
 */

/**
 * Generate a cryptographically random code verifier
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Generate a code challenge from a code verifier using S256 method
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return base64UrlEncode(new Uint8Array(hash))
}

/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

/**
 * Base64 URL encode a byte array
 */
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCodePoint(...buffer))
  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

/**
 * Initialize OAuth2 authorization flow with PKCE
 */
export async function initiateOAuth2Flow(
  authorizationEndpoint: string,
  clientId: string,
  redirectUri: string,
  scope: string = "openid email profile offline_access",
): Promise<void> {
  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateState()

  // Store PKCE parameters in session storage
  sessionStorage.setItem("pkce_code_verifier", codeVerifier)
  sessionStorage.setItem("oauth2_state", state)

  // Build authorization URL
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    // Note: 'prompt' parameter removed to respect user's "remember consent" choice
  })

  const authUrl = `${authorizationEndpoint}?${params.toString()}`

  // Redirect to authorization endpoint
  window.location.href = authUrl
}
