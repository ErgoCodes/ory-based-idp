"use client"

import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { User as UserIcon, Mail, Shield, Hash, Calendar, Clock, Edit2 } from "lucide-react"

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

interface UserInfoProps {
  user: UserProfile
  onEdit: () => void
}

export function UserInfo({ user, onEdit }: UserInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Information</CardTitle>
            <CardDescription>View and manage user details</CardDescription>
          </div>
          <Button onClick={onEdit} size="sm" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InfoItem
            icon={<UserIcon className="h-4 w-4" />}
            label="First Name"
            value={user.traits.name?.first || "Not set"}
          />
          <Separator />
          <InfoItem
            icon={<UserIcon className="h-4 w-4" />}
            label="Last Name"
            value={user.traits.name?.last || "Not set"}
          />
          <Separator />
          <InfoItem
            icon={<Mail className="h-4 w-4" />}
            label="Email Address"
            value={user.traits.email}
          />
          <Separator />
          <InfoItem
            icon={<Shield className="h-4 w-4" />}
            label="Role"
            value={
              <Badge variant={user.traits.role === "superadmin" ? "default" : "secondary"}>
                {user.traits.role === "superadmin" ? "Super Admin" : "User"}
              </Badge>
            }
          />
          <Separator />
          <InfoItem
            icon={<Hash className="h-4 w-4" />}
            label="User ID"
            value={<span className="font-mono text-xs">{user.id}</span>}
          />

          {(user.created_at || user.updated_at) && (
            <>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.created_at && (
                  <InfoItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created At"
                    value={new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                )}
                {user.updated_at && (
                  <InfoItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Last Updated"
                    value={new Date(user.updated_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}
