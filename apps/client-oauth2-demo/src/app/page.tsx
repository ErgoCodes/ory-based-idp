"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function HomePage() {
  const { data: session, status } = useSession()

  const handleLogin = () => {
    signIn("hydra")
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
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
          <div
            className="spinner"
            style={{
              display: "inline-block",
              width: "2rem",
              height: "2rem",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
            }}
          ></div>
          <p style={{ marginTop: "1rem" }}>Loading...</p>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .spinner {
              animation: spin 1s linear infinite;
            }
          `,
          }}
        />
      </div>
    )
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
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
          OAuth2 Client Demo with NextAuth
        </h1>

        {session ? (
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
                ✓ Authenticated with NextAuth
              </p>
              {session.user.name && (
                <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>
                  Name: {session.user.name}
                </p>
              )}
              {session.user.email && (
                <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>
                  Email: {session.user.email}
                </p>
              )}
              <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.5rem" }}>
                ID: {session.user.id}
              </p>
              {session.error && (
                <p style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "0.5rem" }}>
                  ⚠️{" "}
                  {session.error === "RefreshAccessTokenError"
                    ? "Session expired. Please log in again."
                    : session.error}
                </p>
              )}
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
          <>
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
            <a
              href="/login"
              style={{
                fontSize: "0.875rem",
                color: "#3b82f6",
                textDecoration: "none",
              }}
            >
              Or go to login page
            </a>
          </>
        )}

        <p
          style={{
            fontSize: "0.75rem",
            color: "#666",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          This demo uses NextAuth.js with a custom Hydra OAuth2 provider.
          <br />
          Includes automatic token refresh and PKCE support.
        </p>
      </div>
    </div>
  )
}
