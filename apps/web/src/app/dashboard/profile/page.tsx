"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { AuthGuard } from "@/components/auth-guard"
import { RoleBasedNav } from "@/components/role-based-nav"
import { fetchWithAuth } from "@/lib/api/client"
import { ArrowLeft, LogOut, User } from "lucide-react"

interface Profile {
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

function ProfileContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const [passwordMode, setPasswordMode] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchWithAuth("/users/me")

      if (!response.ok) {
        if (response.status === 401) {
          signOut({ callbackUrl: "/login" })
          return
        }
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data)

      // Initialize form data
      setFormData({
        firstName: data.traits.name?.first || "",
        lastName: data.traits.name?.last || "",
        email: data.traits.email,
      })
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetchWithAuth("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: {
            first: formData.firstName,
            last: formData.lastName,
          },
          email: formData.email,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          signOut({ callbackUrl: "/login" })
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to update profile")
      }

      await fetchProfile()
      setEditMode(false)
      alert("Profile updated successfully!")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : "Failed to update profile")
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match on frontend
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    try {
      const response = await fetchWithAuth("/users/me/password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json()
          throw new Error(errorData.error?.message || "Current password is incorrect")
        }
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to change password")
      }

      setPasswordMode(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      alert("Password changed successfully!")
    } catch (err) {
      console.error("Error changing password:", err)
      setError(err instanceof Error ? err.message : "Failed to change password")
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
        </div>
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
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your account settings</p>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-card p-6 border rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

          {!editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-sm">{profile?.traits.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <p className="text-sm">
                  {profile?.traits.name
                    ? `${profile.traits.name.first} ${profile.traits.name.last}`
                    : "Not set"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <p className="text-sm capitalize">{profile?.traits.role}</p>
              </div>
              {profile?.created_at && (
                <div>
                  <label className="block text-sm font-medium mb-1">Member Since</label>
                  <p className="text-sm">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              )}
              <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
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

        {/* Change Password */}
        <div className="bg-card p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>

          {!passwordMode ? (
            <Button onClick={() => setPasswordMode(true)}>Change Password</Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1.5">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1.5">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters
                </p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Update Password</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswordMode(false)
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
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

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}
