import type { UserProfile } from "@/lib/services/actions"
import { UserActions } from "./user-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Mail, Calendar, Shield } from "lucide-react"

interface UserCardProps {
  user: UserProfile
  currentUserId?: string
}

export function UserCard({ user, currentUserId }: UserCardProps) {
  const fullName = user.traits.name
    ? `${user.traits.name.first} ${user.traits.name.last}`
    : "No name set"

  const initials = user.traits.name
    ? `${user.traits.name.first.charAt(0)}${user.traits.name.last.charAt(0)}`.toUpperCase()
    : user.traits.email.charAt(0).toUpperCase()

  const isCurrentUser = user.id === currentUserId

  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-14 w-14 border-2 border-background shadow-md">
            <AvatarImage src="" alt={fullName} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-primary/60">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold truncate">{fullName}</h3>
              <Badge
                variant={user.traits.role === "superadmin" ? "default" : "secondary"}
                className="shrink-0"
              >
                <Shield className="h-3 w-3 mr-1" />
                {user.traits.role === "superadmin" ? "Admin" : "User"}
              </Badge>
              {isCurrentUser && (
                <Badge variant="outline" className="shrink-0">
                  You
                </Badge>
              )}
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.traits.email}</span>
              </div>
              {user.created_at && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Joined{" "}
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <UserActions userId={user.id} userEmail={user.traits.email} disabled={isCurrentUser} />
        </div>
      </CardContent>
    </Card>
  )
}
