"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

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

export default function CallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [error, setError] = useState<string | null>(null)

  // These are only used for validation, not for the actual token exchange
  const clientId = process.env.NEXT_PUBLIC_OAUTH2_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_OAUTH2_REDIRECT_URI

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const errorParam = searchParams.get("error")
        const errorDescription = searchParams.get("error_description")

        if (errorParam) {
          setError(errorDescription || errorParam)
          setStatus("error")
          return
        }

        if (!code) {
          setError("Missing authorization code")
          setStatus("error")
          return
        }

        if (!clientId || !redirectUri) {
          setError("OAuth2 configuration is incomplete")
          setStatus("error")
          return
        }

        const codeVerifier = sessionStorage.getItem("pkce_code_verifier")
        if (!codeVerifier) {
          setError("PKCE code verifier not found. Please restart the authentication flow.")
          setStatus("error")
          return
        }

        const storedState = sessionStorage.getItem("oauth2_state")
        if (state && storedState && state !== storedState) {
          setError("Invalid state parameter. Possible CSRF attack detected.")
          setStatus("error")
          return
        }

        const tokenResponse = await exchangeCodeForTokens(
          code,
          codeVerifier,
          "", // tokenEndpoint - not used anymore
          clientId,
          redirectUri,
        )

        sessionStorage.removeItem("pkce_code_verifier")
        sessionStorage.removeItem("oauth2_state")

        if (tokenResponse.access_token) {
          sessionStorage.setItem("access_token", tokenResponse.access_token)
        }

        if (tokenResponse.refresh_token) {
          sessionStorage.setItem("refresh_token", tokenResponse.refresh_token)
        }

        if (tokenResponse.id_token) {
          const claims = decodeIdToken(tokenResponse.id_token)
          sessionStorage.setItem("user_claims", JSON.stringify(claims))
          // Store the raw ID token for logout
          sessionStorage.setItem("id_token", tokenResponse.id_token)
        }

        setStatus("success")

        setTimeout(() => {
          router.push("/profile")
        }, 1500)
      } catch (err) {
        console.error("OAuth2 callback error:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setStatus("error")
      }
    }

    handleCallback()
  }, [searchParams, router, clientId, redirectUri])

  if (status === "processing") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "inline-block",
                width: "2rem",
                height: "2rem",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </div>
          <p style={{ fontSize: "1.125rem", fontWeight: "500" }}>Completing authentication...</p>
          <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.5rem" }}>Please wait</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            width: "100%",
            padding: "1.5rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#991b1b",
              marginBottom: "0.5rem",
            }}
          >
            Authentication Failed
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "1rem" }}>{error}</p>
          <button
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            width: "100%",
            padding: "1.5rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>✓</span>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#166534",
                margin: 0,
              }}
            >
              Authentication Successful
            </h2>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#166534" }}>Redirecting to your profile...</p>
        </div>
      </div>
    )
  }

  return null
}

async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  _tokenEndpoint: string,
  _clientId: string,
  _redirectUri: string,
): Promise<TokenResponse> {
  // Call our backend API route instead of calling Hydra directly
  // This keeps the token exchange secure and avoids CORS issues
  const response = await fetch("/api/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error_description || errorData.error || "Token exchange failed")
  }

  return response.json()
}

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
