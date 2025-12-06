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
      <div style={styles.container}>
        <div style={{ textAlign: "center" }}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: "1rem", color: "#444" }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Protected Page</h1>

        {/* Session Card */}
        <div style={styles.sessionBox}>
          <p style={styles.sessionHeader}>✓ Authenticated with NextAuth</p>

          {session.user.name && <p style={styles.sessionText}>Name: {session.user.name}</p>}

          {session.user.email && <p style={styles.sessionText}>Email: {session.user.email}</p>}

          {"id" in session.user && <p style={styles.sessionId}>ID: {session.user.id}</p>}

          {(session as any).error && (
            <p style={styles.error}>
              ⚠️{" "}
              {(session as any).error === "RefreshAccessTokenError"
                ? "Session expired. Please log in again."
                : (session as any).error}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div style={styles.buttonColumn}>
          <button onClick={() => router.push("/profile")} style={styles.primaryButton}>
            Go to Profile
          </button>

          <button onClick={() => router.push("/")} style={styles.secondaryButton}>
            Back to Home
          </button>

          <button onClick={() => signOut({ callbackUrl: "/" })} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        {/* Info Section */}
        <div style={styles.infoBox}>
          <h2 style={styles.infoTitle}>About this page</h2>
          <p style={styles.infoText}>
            This is a protected page that requires authentication. NextAuth.js automatically handles
            token refresh, so your session remains active even after the access token expires.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------
   ESTILOS PROFESIONALES
--------------------------------------------------- */

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f4f5f7",
    padding: "2rem",
  },

  card: {
    background: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "620px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.07)",
    border: "1px solid #e5e7eb",
  },

  title: {
    fontSize: "1.7rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#111827",
  },

  sessionBox: {
    padding: "1.2rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    marginBottom: "1.5rem",
  },

  sessionHeader: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#166534",
    marginBottom: "0.5rem",
  },

  sessionText: {
    fontSize: "0.9rem",
    color: "#374151",
    margin: "0.25rem 0",
  },

  sessionId: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.5rem",
    wordBreak: "break-all",
  },

  error: {
    fontSize: "0.8rem",
    color: "#dc2626",
    marginTop: "0.5rem",
  },

  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
  },

  primaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
  },

  secondaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f9fafb",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
  },

  logoutButton: {
    padding: "0.75rem 1.5rem",
    background: "#ffffff",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
  },

  infoBox: {
    marginTop: "2rem",
    padding: "1.2rem",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  infoTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#111827",
  },

  infoText: {
    fontSize: "0.875rem",
    color: "#6b7280",
    lineHeight: 1.6,
  },

  spinner: {
    display: "inline-block",
    width: "2rem",
    height: "2rem",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
}
