"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { AuthGuard } from "@/components/auth-guard"
import { Copy, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"

function ClientSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})

  const clientId = searchParams.get("client_id")
  const clientSecret = searchParams.get("client_secret")
  const clientName = searchParams.get("client_name")

  useEffect(() => {
    // If no client data, redirect to dashboard
    if (!clientId) {
      router.push("/dashboard")
    }
  }, [clientId, router])

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied({ ...copied, [key]: true })
      setTimeout(() => {
        setCopied({ ...copied, [key]: false })
      }, 2000)
    } catch {
      // Silently fail
    }
  }

  if (!clientId) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Client Created Successfully!</h1>
            <p className="text-sm text-muted-foreground">
              {clientName || "Your OAuth2 client"} has been registered
            </p>
          </div>
        </div>

        {clientSecret && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900 dark:text-yellow-200 mb-1">
                  Important: Save your client secret now!
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  This is the only time you'll be able to see the client secret. Make sure to copy
                  and store it securely.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 bg-card p-6 border rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Client ID</label>
            <div className="flex gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono break-all">
                {clientId}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(clientId, "clientId")}
              >
                {copied.clientId ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {clientSecret && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Client Secret
                <span className="ml-2 text-xs text-destructive">(Save this now!)</span>
              </label>
              <div className="flex gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono break-all">
                  {clientSecret}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(clientSecret, "clientSecret")}
                >
                  {copied.clientSecret ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              You can now use these credentials to configure your application to authenticate with
              this OAuth2 provider.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => router.push("/dashboard")} className="flex-1">
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/clients/${clientId}`)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>

        {clientSecret && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Security Note:</strong> Store your client secret in a secure location such as
              environment variables or a secrets manager. Never commit it to version control or
              expose it in client-side code.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ClientSuccessPage() {
  return (
    <AuthGuard>
      <ClientSuccessContent />
    </AuthGuard>
  )
}
