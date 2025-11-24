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
        return "An error occurred during authentication. Please try again."
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          padding: "2rem",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>Sign In</h1>

        <p style={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "center", margin: 0 }}>
          Sign in to your account using OAuth2
        </p>

        {error && (
          <div
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: "#dc2626",
                margin: 0,
              }}
            >
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem 1.5rem",
            backgroundColor: loading ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
        >
          {loading ? "Signing in..." : "Sign in with OAuth2"}
        </button>

        <p
          style={{
            fontSize: "0.75rem",
            color: "#9ca3af",
            textAlign: "center",
            margin: 0,
          }}
        >
          You will be redirected to the authentication provider
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#f9fafb",
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
            <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
