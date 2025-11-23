"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { AuthGuard } from "@/components/auth-guard"
import type { OAuth2Client } from "@/types/oauth-client.types"
import { ArrowLeft, Trash2, Copy, CheckCircle } from "lucide-react"

function ClientDetailsContent() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<OAuth2Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (clientId) {
      fetchClient()
    }
  }, [clientId])

  const fetchClient = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/oauth2/clients/${clientId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch client details")
      }

      const data = await response.json()
      setClient(data)
    } catch (err) {
      console.error("Error fetching client:", err)
      setError(err instanceof Error ? err.message : "Failed to load client")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${client?.client_name}"? This action cannot be undone.`,
      )
    ) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/oauth2/clients/${clientId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete client")
      }

      router.push("/dashboard")
    } catch (err) {
      console.error("Error deleting client:", err)
      alert("Failed to delete client")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    )
  }

  if (error || !client) {
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
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto p-6 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive">{error || "Client not found"}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Client
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{client.client_name}</h1>
          <p className="text-sm text-muted-foreground">OAuth2 Client Details</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-card p-6 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client ID</label>
                <div className="flex gap-2">
                  <code className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono break-all">
                    {client.client_id}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(client.client_id)}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Client Name</label>
                <p className="px-3 py-2 bg-muted rounded-md text-sm">{client.client_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Token Endpoint Auth Method</label>
                <p className="px-3 py-2 bg-muted rounded-md text-sm">
                  {client.token_endpoint_auth_method}
                </p>
              </div>
            </div>
          </div>

          {/* Redirect URIs */}
          <div className="bg-card p-6 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Redirect URIs</h2>
            <div className="space-y-2">
              {client.redirect_uris.map((uri, idx) => (
                <div key={idx} className="px-3 py-2 bg-muted rounded-md text-sm font-mono">
                  {uri}
                </div>
              ))}
            </div>
          </div>

          {/* Post Logout Redirect URIs */}
          {client.post_logout_redirect_uris && client.post_logout_redirect_uris.length > 0 && (
            <div className="bg-card p-6 border rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Post Logout Redirect URIs</h2>
              <div className="space-y-2">
                {client.post_logout_redirect_uris.map((uri, idx) => (
                  <div key={idx} className="px-3 py-2 bg-muted rounded-md text-sm font-mono">
                    {uri}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OAuth2 Configuration */}
          <div className="bg-card p-6 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">OAuth2 Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Grant Types</label>
                <div className="flex flex-wrap gap-2">
                  {client.grant_types.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Response Types</label>
                <div className="flex flex-wrap gap-2">
                  {client.response_types.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scopes</label>
                <div className="flex flex-wrap gap-2">
                  {client.scope.split(" ").map((scope, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {client.created_at && (
            <div className="bg-card p-6 border rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Metadata</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(client.created_at).toLocaleString()}</span>
                </div>
                {client.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date(client.updated_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ClientDetailsPage() {
  return (
    <AuthGuard>
      <ClientDetailsContent />
    </AuthGuard>
  )
}
