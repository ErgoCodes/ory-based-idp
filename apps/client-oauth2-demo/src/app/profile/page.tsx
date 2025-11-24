"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

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
          <p style={{ marginTop: "1rem" }}>Loading your profile...</p>
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

  if (!session) {
    return null
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "2rem",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            User Profile
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Your information from NextAuth + Hydra OAuth2
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                  backgroundColor: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "white",
                  marginRight: "1rem",
                }}
              >
                {session.user.name
                  ? session.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : session.user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                  {session.user.name || "User"}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#166534" }}>{session.user.email}</p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Profile Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                  Subject ID
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#111827",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {session.user.id}
                </p>
              </div>

              {session.user.email && (
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                    Email
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <p style={{ fontSize: "0.875rem", color: "#111827" }}>{session.user.email}</p>
                    {session.user.emailVerified && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.125rem 0.5rem",
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                          borderRadius: "9999px",
                          fontWeight: "500",
                        }}
                      >
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              )}

              {session.user.name && (
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                    Full Name
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#111827" }}>{session.user.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
          <button
            onClick={() => router.push("/protected")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Go to Protected Page
          </button>

          <button
            onClick={() => router.push("/")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Back to Home
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "white",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#eff6ff",
            borderRadius: "8px",
            border: "1px solid #bfdbfe",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "#1e40af", lineHeight: "1.5" }}>
            <strong>💡 NextAuth Integration:</strong> This profile uses NextAuth.js session
            management with automatic token refresh. The access token is automatically refreshed
            when it expires using the refresh token.
          </p>
        </div>
      </div>
    </div>
  )
}
