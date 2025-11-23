"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchWithAuth, isAuthenticated, clearTokens } from "@/lib/token-manager"

interface UserInfo {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  given_name?: string
  family_name?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/")
      return
    }

    // Fetch user info from userinfo endpoint
    fetchUserInfo()
  }, [router])

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchWithAuth("/api/auth/userinfo")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || "Failed to fetch user information")
      }

      const data: UserInfo = await response.json()
      setUserInfo(data)
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch user info:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)

      // If authentication failed, redirect to home
      if (err instanceof Error && err.message.includes("log in again")) {
        setTimeout(() => router.push("/"), 2000)
      }
    }
  }

  const handleLogout = () => {
    // Use OIDC logout flow
    // Only pass post_logout_redirect_uri if client has it configured
    // For now, don't pass it - will use Hydra's default
    const { performCompleteLogout } = require("@/lib/logout")
    performCompleteLogout()
  }

  const handleRefreshData = () => {
    fetchUserInfo()
  }

  if (loading) {
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
          <p style={{ marginTop: "1rem" }}>Loading your profile...</p>
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
            Your information from the OAuth2 provider
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "#991b1b" }}>{error}</p>
          </div>
        )}

        {userInfo && (
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
                  {userInfo.name
                    ? userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : userInfo.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                    {userInfo.name || "User"}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "#166534" }}>{userInfo.email}</p>
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
                    {userInfo.sub}
                  </p>
                </div>

                {userInfo.email && (
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                      Email
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <p style={{ fontSize: "0.875rem", color: "#111827" }}>{userInfo.email}</p>
                      {userInfo.email_verified && (
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

                {userInfo.name && (
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                      Full Name
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#111827" }}>{userInfo.name}</p>
                  </div>
                )}

                {userInfo.given_name && (
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                      First Name
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#111827" }}>{userInfo.given_name}</p>
                  </div>
                )}

                {userInfo.family_name && (
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                      Last Name
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#111827" }}>{userInfo.family_name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
          <button
            onClick={handleRefreshData}
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>

          <button
            onClick={() => router.push("/protected")}
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
            Go to Protected Page
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
            <strong>💡 Testing the implementation:</strong> This data comes from Hydra's userinfo
            endpoint, which gets the claims from the consent session. The claims are populated from
            Kratos identity data based on the granted scopes (email, profile).
          </p>
        </div>
      </div>
    </div>
  )
}
