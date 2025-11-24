"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@workspace/ui/components/button"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center gap-6 text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold">OAuth2 Identity Provider</h1>
        <p className="text-muted-foreground max-w-md">
          This application provides login and consent screens for OAuth2/OIDC authentication, and
          allows administrators to manage OAuth2 clients.
        </p>

        <div className="flex gap-4 mt-4">
          <Button onClick={() => router.push("/login")} size="lg">
            Admin Login
          </Button>
          <Button onClick={() => router.push("/register")} variant="outline" size="lg">
            Register
          </Button>
        </div>

        <div className="mt-8 p-6 bg-card border rounded-lg text-left w-full max-w-md">
          <p className="font-medium mb-3">Available endpoints:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <code className="px-2 py-1 bg-muted rounded text-xs">/oauth2/login</code> - Login page
            </li>
            <li>
              <code className="px-2 py-1 bg-muted rounded text-xs">/oauth2/consent</code> - Consent
              page
            </li>
            <li>
              <code className="px-2 py-1 bg-muted rounded text-xs">/oauth2/logout</code> - Logout
              page
            </li>
            <li>
              <code className="px-2 py-1 bg-muted rounded text-xs">/dashboard</code> - Admin
              dashboard
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
