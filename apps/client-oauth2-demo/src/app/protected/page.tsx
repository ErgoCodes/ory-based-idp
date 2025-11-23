"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchWithAuth, isAuthenticated, getUserClaims } from "@/lib/token-manager"

interface UserInfo {
  sub: string
  email?: string
  name?: string
  email_verified?: boolean
}

export default function ProtectedPage() {
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

    // Load user claims from storage
    const claims = getUserClaims()
    if (claims) {
      setUserInfo(claims)
    }

    setLoading(false)
  }, [router])

  const handleTestApiCall = async () => {
    try {
      setError(null)
      setLoading(true)

      // Make an authenticated API call through our proxy
      // This will automatically refresh the token if it's expired
      const response = await fetchWithAuth("/api/auth/userinfo")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error_description || `API call failed: ${response.statusText}`)
      }

      const data = await response.json()
      setUserInfo(data)
      setLoading(false)
      alert("✅ API call successful! User info retrieved and token is valid.")
    } catch (err) {
      console.error("API call error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)

      // If authentication failed, redirect to home
      if (err instanceof Error && err.message.includes("log in again")) {
        setTimeout(() => router.push("/"), 2000)
      }
    }
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
          <p style={{ marginTop: "1rem" }}>Loading...</p>
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
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
          Protected Page
        </h1>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "8px",
            marginBottom: "1.5rem",
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
          {userInfo && (
            <>
              {userInfo.name && (
                <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>Name: {userInfo.name}</p>
              )}
              {userInfo.email && (
                <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>Email: {userInfo.email}</p>
              )}
              <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.5rem" }}>
                Subject: {userInfo.sub}
              </p>
            </>
          )}
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

        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <button
            onClick={handleTestApiCall}
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Loading..." : "Test Token Refresh"}
          </button>

          <button
            onClick={() => router.push("/")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#fff",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Back to Home
          </button>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            About this page
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#666", lineHeight: "1.5" }}>
            This page demonstrates automatic token refresh. When you click "Test Token Refresh", it
            will make an authenticated API call to fetch your user information. If your access token
            has expired, it will automatically refresh it using the refresh token and retry the
            request.
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#999",
              marginTop: "0.5rem",
              fontStyle: "italic",
            }}
          >
            Tip: To test the auto-refresh, delete your access_token from sessionStorage and click
            the button. You'll see it automatically refresh and succeed.
          </p>
        </div>
      </div>
    </div>
  )
}
