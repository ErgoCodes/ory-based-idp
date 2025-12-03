"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteUserAction } from "@/lib/services/user"
import { UserInfo } from "./user-info"
import { UserEditForm } from "./user-edit-form"

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

interface UserDetailsViewProps {
  user: UserProfile
  currentUserId?: string
}

export function UserDetailsView({ user, currentUserId }: UserDetailsViewProps) {
  const router = useRouter()
  const [editMode, setEditMode] = useState(false)

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        {user.id !== currentUserId && (
          <Button variant="destructive" size="sm" onClick={handleDeleteUser}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </Button>
        )}
      </div>

      {editMode ? (
        <UserEditForm
          user={user}
          onCancel={() => setEditMode(false)}
          onSuccess={() => {
            setEditMode(false)
            router.refresh()
          }}
        />
      ) : (
        <UserInfo user={user} onEdit={() => setEditMode(true)} />
      )}
    </div>
  )
}
