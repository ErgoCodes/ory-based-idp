"use client"

import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(getErrorMessage(errorParam))
    }
  }, [searchParams])

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case "Callback":
      case "OAuthCallback":
        return "Invalid credentials. Please check your email and password."
      case "OAuthSignin":
        return "Error connecting to the authentication provider."
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
        return "Could not create account. Please try again."
      case "OAuthAccountNotLinked":
        return "This account is already linked to another provider."
      case "EmailSignin":
        return "Error sending verification email."
      case "CredentialsSignin":
        return "Invalid credentials. Please try again."
      case "SessionRequired":
        return "Please sign in to access this page."
      default:
        return "An authentication error occurred. Please try again."
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn("hydra", {
        redirect: false,
        callbackUrl: "/",
      })

      if (result?.error) {
        setError(getErrorMessage(result.error))
        setLoading(false)
      } else if (result?.ok) {
        router.push("/")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>Sign in to your account using OAuth2</p>

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.primaryButton,
            backgroundColor: loading ? "#9ca3af" : styles.primaryButton?.backgroundColor,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in with OAuth2"}
        </button>

        <p style={styles.bottomNote}>You will be redirected to the authentication provider</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.container}>
          <div style={{ textAlign: "center" }}>
            <div style={styles.spinner}></div>
            <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}

/* ---------------------------------------------------
   ESTILOS UNIFICADOS (Mismo estilo que otras páginas)
--------------------------------------------------- */

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
    backgroundColor: "#f4f5f7",
    padding: "2rem",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
  },

  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    fontSize: "0.9rem",
    color: "#6b7280",
    margin: 0,
  },

  errorBox: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
  },

  errorText: {
    fontSize: "0.875rem",
    color: "#dc2626",
    margin: 0,
  },

  primaryButton: {
    width: "100%",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },

  bottomNote: {
    fontSize: "0.75rem",
    color: "#9ca3af",
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
