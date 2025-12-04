"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Calendar, Mail, Shield, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteUserAction } from "@/lib/services/user"

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

interface UserDetailHeaderProps {
  user: UserProfile
  currentUserId?: string
}

export function UserDetailHeader({ user, currentUserId }: UserDetailHeaderProps) {
  const router = useRouter()

  const fullName = user.traits.name ? `${user.traits.name.first} ${user.traits.name.last}` : "User"

  const initials = user.traits.name
    ? `${user.traits.name.first.charAt(0)}${user.traits.name.last.charAt(0)}`.toUpperCase()
    : user.traits.email.charAt(0).toUpperCase()

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown"

  const handleDeleteUser = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      const result = await deleteUserAction(user.id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("User deleted successfully")
        router.push("/dashboard/users")
      }
    } catch {
      toast.error("Failed to delete user")
    }
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard/users")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Button>

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted/20 p-8">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/60">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-background bg-green-500" />
          </div>

          {/* User Info Section */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
              <Badge
                variant={user.traits.role === "superadmin" ? "default" : "secondary"}
                className="w-fit"
              >
                <Shield className="h-3 w-3 mr-1" />
                {user.traits.role === "superadmin" ? "Super Admin" : "User"}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.traits.email}</span>
              </div>
              {user.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {memberSince}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {user.id !== currentUserId && (
            <Button variant="destructive" size="sm" onClick={handleDeleteUser} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete User
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
