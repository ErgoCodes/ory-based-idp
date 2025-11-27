"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedNav } from "@/components/role-based-nav"
import type { OAuth2Client } from "@/types/oauth-client.types"
import { Plus, Trash2, LogOut, User, Eye } from "lucide-react"
import { fetchWithAuth } from "@/lib/api/client"
import { toast } from "sonner"

function DashboardContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [clients, setClients] = useState<OAuth2Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchWithAuth("/oauth2/clients")

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          signOut({ callbackUrl: "/login" })
          return
        }
        throw new Error("Failed to fetch clients")
      }

      const data = await response.json()

      // The backend interceptor extracts the value automatically
      // So data is already the array of clients
      setClients(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) {
      return
    }

    try {
      const response = await fetchWithAuth(`/oauth2/clients/${clientId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 401) {
          signOut({ callbackUrl: "/login" })
          return
        }
        throw new Error("Failed to delete client")
      }

      // Refresh the list
      fetchClients()
    } catch {
      toast.error("Failed to delete client")
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {session?.user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="capitalize">{session?.user?.role}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <RoleBasedNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {session?.user?.role === "superadmin" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">OAuth2 Clients</h2>
                <p className="text-sm text-muted-foreground">
                  {clients.length} client{clients.length !== 1 ? "s" : ""} registered
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/clients/new")}>
                <Plus className="h-4 w-4 mr-2" />
                New Client
              </Button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading clients...</p>
                </div>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12 bg-card border rounded-lg">
                <p className="text-muted-foreground mb-4">No clients registered yet</p>
                <Button onClick={() => router.push("/dashboard/clients/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first client
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {clients.map((client) => (
                  <div
                    key={client.client_id}
                    className="p-6 bg-card border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{client.client_name}</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Client ID:</span>
                            <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                              {client.client_id}
                            </code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Redirect URIs:</span>
                            <div className="mt-1 space-y-1">
                              {client.redirect_uris.map((uri, idx) => (
                                <div key={idx} className="ml-2">
                                  <code className="px-2 py-1 bg-muted rounded text-xs">{uri}</code>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Grant Types:</span>
                            <span className="ml-2">{client.grant_types.join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Scopes:</span>
                            <span className="ml-2">{client.scope}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/clients/${client.client_id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClient(client.client_id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Welcome to your Dashboard</h2>
            <p className="text-muted-foreground mb-4">
              You can manage your profile and settings from here.
            </p>
            <Button onClick={() => router.push("/dashboard/profile")}>Go to Profile</Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
