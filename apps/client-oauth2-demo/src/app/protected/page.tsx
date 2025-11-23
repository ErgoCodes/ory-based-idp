"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

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
            ✓ Authenticated with NextAuth
          </p>
          {session.user.name && (
            <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>Name: {session.user.name}</p>
          )}
          {session.user.email && (
            <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>Email: {session.user.email}</p>
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

        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <button
            onClick={() => router.push("/profile")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Go to Profile
          </button>

          <button
            onClick={() => router.push("/")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Back to Home
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "white",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: "4px",
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
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            About this page
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#666", lineHeight: "1.5" }}>
            This is a protected page that requires authentication. NextAuth.js automatically handles
            token refresh, so your session stays active even after the access token expires.
          </p>
        </div>
      </div>
    </div>
  )
}
