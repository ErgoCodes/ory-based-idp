"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedNav } from "@/components/role-based-nav"
import { fetchWithAuth } from "@/lib/api/client"
import { toast } from "sonner"
import { ArrowLeft, LogOut, User, Trash2 } from "lucide-react"

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
  updated_at?: string
}

function UserDetailsContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user" as "user" | "superadmin",
  })

  useEffect(() => {
    // Check if user is superadmin
    if (session?.user?.role !== "superadmin") {
      router.push("/dashboard")
      return
    }

    if (userId) {
      fetchUser()
    }
  }, [session, router, userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchWithAuth(`/admin/users/${userId}`)

      if (!response.ok) {
        if (response.status === 401) {
          signOut({ callbackUrl: "/login" })
          return
        }
        if (response.status === 403) {
          router.push("/dashboard")
          return
        }
        throw new Error("Failed to fetch user")
      }

      const data = await response.json()
      setUser(data)

      // Initialize form data
      setFormData({
        firstName: data.traits.name?.first || "",
        lastName: data.traits.name?.last || "",
        email: data.traits.email,
        role: data.traits.role,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetchWithAuth(`/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: {
            first: formData.firstName,
            last: formData.lastName,
          },
          email: formData.email,
          role: formData.role,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          signOut({ callbackUrl: "/login" })
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to update user")
      }

      await fetchUser()
      setEditMode(false)
      toast.success("User updated successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user")
    }
  }

  const handleDeleteUser = async () => {
    if (!confirm(`Are you sure you want to delete this user? This action cannot be undone.`)) {
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

      toast.success("User deleted successfully")
      router.push("/dashboard/users")
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
          <p className="mt-2 text-sm text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/users")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto p-6 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive">{error || "User not found"}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">User Details</h1>
              <p className="text-sm text-muted-foreground">View and manage user information</p>
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          {user.id !== session?.user?.id && (
            <Button variant="destructive" size="sm" onClick={handleDeleteUser}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* User Information */}
        <div className="bg-card p-6 border rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">User Information</h2>

          {!editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-sm">{user.traits.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <p className="text-sm">
                  {user.traits.name
                    ? `${user.traits.name.first} ${user.traits.name.last}`
                    : "Not set"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full ${
                    user.traits.role === "superadmin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.traits.role}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">User ID</label>
                <code className="text-sm px-2 py-1 bg-muted rounded">{user.id}</code>
              </div>
              {user.created_at && (
                <div>
                  <label className="block text-sm font-medium mb-1">Created</label>
                  <p className="text-sm">{new Date(user.created_at).toLocaleString()}</p>
                </div>
              )}
              {user.updated_at && (
                <div>
                  <label className="block text-sm font-medium mb-1">Last Updated</label>
                  <p className="text-sm">{new Date(user.updated_at).toLocaleString()}</p>
                </div>
              )}
              <Button onClick={() => setEditMode(true)}>Edit User</Button>
            </div>
          ) : (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1.5">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as "user" | "superadmin" })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="user">User</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditMode(false)
                    setError(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default function UserDetailsPage() {
  return (
    <AuthGuard>
      <UserDetailsContent />
    </AuthGuard>
  )
}
