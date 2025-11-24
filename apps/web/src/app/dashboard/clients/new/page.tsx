"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@workspace/ui/components/button"
import { AuthGuard } from "@/components/auth-guard"
import { ArrowLeft, Plus, X } from "lucide-react"
import { fetchWithAuth } from "@/lib/api/client"

function NewClientContent() {
  const { data: session } = useSession()
  const router = useRouter()

  // Redirect if not superadmin
  useEffect(() => {
    if (session && session.user?.role !== "superadmin") {
      router.push("/dashboard")
    }
  }, [session, router])

  const [formData, setFormData] = useState({
    client_name: "",
    redirect_uris: [""],
    post_logout_redirect_uris: [""],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    scope: "openid email profile offline_access",
    token_endpoint_auth_method: "none",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Filter out empty URIs
    const cleanedData = {
      ...formData,
      redirect_uris: formData.redirect_uris.filter((uri) => uri.trim() !== ""),
      post_logout_redirect_uris: formData.post_logout_redirect_uris.filter(
        (uri) => uri.trim() !== "",
      ),
    }

    if (cleanedData.redirect_uris.length === 0) {
      setError("At least one redirect URI is required")
      setLoading(false)
      return
    }

    try {
      const response = await fetchWithAuth("/oauth2/clients", {
        method: "POST",
        body: JSON.stringify(cleanedData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          signOut({ callbackUrl: "/login" })
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create client")
      }

      const result = await response.json()

      // Redirect to success page with client credentials
      const params = new URLSearchParams({
        client_id: result.client_id,
        client_name: result.client_name || cleanedData.client_name,
      })

      // Only include client_secret if it exists (for confidential clients)
      if (result.client_secret) {
        params.append("client_secret", result.client_secret)
      }

      router.push(`/dashboard/clients/success?${params.toString()}`)
    } catch (err) {
      console.error("Error creating client:", err)
      setError(err instanceof Error ? err.message : "Failed to create client")
      setLoading(false)
    }
  }

  const addRedirectUri = () => {
    setFormData({
      ...formData,
      redirect_uris: [...formData.redirect_uris, ""],
    })
  }

  const removeRedirectUri = (index: number) => {
    setFormData({
      ...formData,
      redirect_uris: formData.redirect_uris.filter((_, i) => i !== index),
    })
  }

  const updateRedirectUri = (index: number, value: string) => {
    const newUris = [...formData.redirect_uris]
    newUris[index] = value
    setFormData({ ...formData, redirect_uris: newUris })
  }

  const addPostLogoutUri = () => {
    setFormData({
      ...formData,
      post_logout_redirect_uris: [...formData.post_logout_redirect_uris, ""],
    })
  }

  const removePostLogoutUri = (index: number) => {
    setFormData({
      ...formData,
      post_logout_redirect_uris: formData.post_logout_redirect_uris.filter((_, i) => i !== index),
    })
  }

  const updatePostLogoutUri = (index: number, value: string) => {
    const newUris = [...formData.post_logout_redirect_uris]
    newUris[index] = value
    setFormData({ ...formData, post_logout_redirect_uris: newUris })
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Create New OAuth2 Client</h1>
          <p className="text-sm text-muted-foreground">
            Register a new application to use your identity provider
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 border rounded-lg">
          <div>
            <label htmlFor="client_name" className="block text-sm font-medium mb-1.5">
              Client Name *
            </label>
            <input
              id="client_name"
              type="text"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              required
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              placeholder="My Application"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Redirect URIs *</label>
            <p className="text-xs text-muted-foreground mb-2">
              URLs where users will be redirected after authentication
            </p>
            <div className="space-y-2">
              {formData.redirect_uris.map((uri, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={uri}
                    onChange={(e) => updateRedirectUri(index, e.target.value)}
                    disabled={loading}
                    className="flex-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    placeholder="http://localhost:3000/callback"
                  />
                  {formData.redirect_uris.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRedirectUri(index)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRedirectUri}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Redirect URI
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Post Logout Redirect URIs</label>
            <p className="text-xs text-muted-foreground mb-2">
              URLs where users will be redirected after logout
            </p>
            <div className="space-y-2">
              {formData.post_logout_redirect_uris.map((uri, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={uri}
                    onChange={(e) => updatePostLogoutUri(index, e.target.value)}
                    disabled={loading}
                    className="flex-1 px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    placeholder="http://localhost:3000"
                  />
                  {formData.post_logout_redirect_uris.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePostLogoutUri(index)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPostLogoutUri}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Post Logout URI
              </Button>
            </div>
          </div>

          <div>
            <label htmlFor="scope" className="block text-sm font-medium mb-1.5">
              Scopes
            </label>
            <input
              id="scope"
              type="text"
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              placeholder="openid email profile"
            />
            <p className="text-xs text-muted-foreground mt-1">Space-separated list of scopes</p>
          </div>

          <div>
            <label
              htmlFor="token_endpoint_auth_method"
              className="block text-sm font-medium mb-1.5"
            >
              Token Endpoint Auth Method
            </label>
            <select
              id="token_endpoint_auth_method"
              value={formData.token_endpoint_auth_method}
              onChange={(e) =>
                setFormData({ ...formData, token_endpoint_auth_method: e.target.value })
              }
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              <option value="none">None (Public Client with PKCE) - Recommended for SPAs</option>
              <option value="client_secret_basic">Client Secret Basic - For Backend Servers</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Use PKCE for public clients (SPAs, mobile apps). Use Client Secret Basic for
              confidential clients (backend servers).
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Client"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function NewClientPage() {
  return (
    <AuthGuard>
      <NewClientContent />
    </AuthGuard>
  )
}
