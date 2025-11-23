"use client"

import { useEffect, useState } from "react"
import { initiateOAuth2Flow } from "@/lib/pkce"
import { getUserClaims, isAuthenticated } from "@/lib/token-manager"
import { performCompleteLogout } from "@/lib/logout"

export default function HomePage() {
  const [userClaims, setUserClaims] = useState<{
    sub: string
    email?: string
    name?: string
  } | null>(null)

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      const claims = getUserClaims()
      setUserClaims(claims)
    }
  }, [])

  const handleLogin = async () => {
    const authEndpoint = process.env.NEXT_PUBLIC_OAUTH2_AUTHORIZATION_ENDPOINT
    const clientId = process.env.NEXT_PUBLIC_OAUTH2_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_OAUTH2_REDIRECT_URI
    const scope = process.env.NEXT_PUBLIC_OAUTH2_SCOPE || "openid email profile offline_access"

    if (!authEndpoint || !clientId || !redirectUri) {
      alert("OAuth2 configuration is incomplete. Please check your .env.local file.")
      return
    }

    await initiateOAuth2Flow(authEndpoint, clientId, redirectUri, scope)
  }

  const handleLogout = () => {
    // Use OIDC logout flow
    // Only pass post_logout_redirect_uri if client has it configured
    // For now, don't pass it - will use Hydra's default
    performCompleteLogout()
  }

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>OAuth2 Client Demo</h1>

        {userClaims ? (
          <div style={{ textAlign: "center", width: "100%" }}>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#166534",
                  marginBottom: "0.5rem",
                }}
              >
                ✓ Authenticated
              </p>
              {userClaims.name && (
                <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>Name: {userClaims.name}</p>
              )}
              {userClaims.email && (
                <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>
                  Email: {userClaims.email}
                </p>
              )}
              <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.5rem" }}>
                Subject: {userClaims.sub}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <a
                href="/profile"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                View Profile
              </a>
              <a
                href="/protected"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Protected Page (Test Refresh)
              </a>
              <button
                onClick={handleLogout}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Login with OAuth2
          </button>
        )}

        <p
          style={{
            fontSize: "0.75rem",
            color: "#666",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          This is a demo OAuth2 client application.
          <br />
          It uses Hydra for authentication.
        </p>
      </div>
    </div>
  )
}
