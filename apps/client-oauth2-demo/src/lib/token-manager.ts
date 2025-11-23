/**
 * Token Manager
 * Handles access token refresh and automatic retry logic
 */

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  id_token?: string
  scope?: string
}

interface UserClaims {
  sub: string
  email?: string
  name?: string
  email_verified?: boolean
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(): Promise<TokenResponse | null> {
  try {
    const refreshToken = sessionStorage.getItem("refresh_token")

    if (!refreshToken) {
      console.error("No refresh token available")
      return null
    }

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Token refresh failed:", errorData)

      // If refresh token is invalid or expired, clear all tokens
      if (errorData.error === "invalid_grant" || response.status === 401) {
        clearTokens()
      }

      return null
    }

    const tokenData: TokenResponse = await response.json()

    // Update stored tokens
    if (tokenData.access_token) {
      sessionStorage.setItem("access_token", tokenData.access_token)
    }

    if (tokenData.refresh_token) {
      sessionStorage.setItem("refresh_token", tokenData.refresh_token)
    }

    if (tokenData.id_token) {
      const claims = decodeIdToken(tokenData.id_token)
      sessionStorage.setItem("user_claims", JSON.stringify(claims))
    }

    console.log("Access token refreshed successfully")
    return tokenData
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

/**
 * Make an authenticated API request with automatic token refresh
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = sessionStorage.getItem("access_token")

  if (!accessToken) {
    throw new Error("No access token available")
  }

  // Add authorization header
  const headers = new Headers(options.headers)
  headers.set("Authorization", `Bearer ${accessToken}`)

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
  })

  // If unauthorized, try to refresh the token and retry
  if (response.status === 401) {
    console.log("Access token expired, attempting refresh...")

    const tokenData = await refreshAccessToken()

    if (!tokenData) {
      throw new Error("Failed to refresh access token. Please log in again.")
    }

    // Retry the request with the new token
    headers.set("Authorization", `Bearer ${tokenData.access_token}`)
    response = await fetch(url, {
      ...options,
      headers,
    })
  }

  return response
}

/**
 * Get the current access token, refreshing if necessary
 */
export async function getAccessToken(): Promise<string | null> {
  let accessToken = sessionStorage.getItem("access_token")

  if (!accessToken) {
    return null
  }

  // Check if token is expired (basic check - you could decode JWT and check exp claim)
  // For now, we'll rely on the 401 response from the API

  return accessToken
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!sessionStorage.getItem("access_token")
}

/**
 * Clear all stored tokens
 */
export function clearTokens(): void {
  sessionStorage.removeItem("access_token")
  sessionStorage.removeItem("refresh_token")
  sessionStorage.removeItem("user_claims")
  sessionStorage.removeItem("id_token")
  sessionStorage.removeItem("pkce_code_verifier")
  sessionStorage.removeItem("oauth2_state")
}

/**
 * Get stored user claims
 */
export function getUserClaims(): UserClaims | null {
  const claims = sessionStorage.getItem("user_claims")
  return claims ? JSON.parse(claims) : null
}

/**
 * Decode ID token to extract user claims
 */
function decodeIdToken(idToken: string): UserClaims {
  try {
    const parts = idToken.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid ID token format")
    }

    const payload = parts[1]
    if (!payload) {
      throw new Error("Invalid ID token payload")
    }

    const base64 = payload.replaceAll("-", "+").replaceAll("_", "/")
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    const jsonPayload = atob(paddedBase64)
    const claims = JSON.parse(jsonPayload) as UserClaims

    return claims
  } catch (err) {
    console.error("Failed to decode ID token:", err)
    throw new Error("Failed to decode ID token")
  }
}
