"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserDetailHeader } from "./user-detail-header"
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

  return (
    <div className="space-y-6">
      <UserDetailHeader user={user} currentUserId={currentUserId} />

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
