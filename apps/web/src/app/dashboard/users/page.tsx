"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedNav } from "@/components/role-based-nav"
import { toast } from "sonner"
import { fetchWithAuth } from "@/lib/api/client"
import { ArrowLeft, LogOut, User, Eye, Trash2 } from "lucide-react"

interface UserProfile {
  id: string
  traits: {
    email: string
    name?: {
      first: string
      last: string
    }
    role: "user" | "superadmin"
  }
  created_at?: string
}

function UsersContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is superadmin
    if (session?.user?.role !== "superadmin") {
      router.push("/dashboard")
      return
    }

    fetchUsers()
  }, [session, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchWithAuth("/admin/users")

      if (!response.ok) {
        if (response.status === 401) {
          signOut({ callbackUrl: "/login" })
          return
        }
        if (response.status === 403) {
          router.push("/dashboard")
          return
        }
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (
      !confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)
    ) {
      return
    }

    try {
      const response = await fetchWithAuth(`/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 401) {
          signOut({ callbackUrl: "/login" })
          return
        }
        throw new Error("Failed to delete user")
      }

      // Refresh the list
      fetchUsers()
      toast.success("User deleted successfully")
    } catch {
      toast.error("Failed to delete user")
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  if (session?.user?.role !== "superadmin") {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">All Users</h2>
          <p className="text-sm text-muted-foreground">
            {users.length} user{users.length !== 1 ? "s" : ""} registered
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {users.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-lg">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-6 bg-card border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {user.traits.name
                          ? `${user.traits.name.first} ${user.traits.name.last}`
                          : "No name set"}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.traits.role === "superadmin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.traits.role}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <span className="ml-2">{user.traits.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">User ID:</span>
                        <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">{user.id}</code>
                      </div>
                      {user.created_at && (
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <span className="ml-2">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.traits.email)}
                      disabled={user.id === session?.user?.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function UsersPage() {
  return (
    <AuthGuard>
      <UsersContent />
    </AuthGuard>
  )
}
