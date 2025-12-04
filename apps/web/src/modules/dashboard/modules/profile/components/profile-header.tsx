"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Calendar, Mail, Shield, User as UserIcon } from "lucide-react"
import { type UserProfile } from "@/lib/services/user"

interface ProfileHeaderProps {
  profile: UserProfile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { data: session } = useSession()

  const fullName = profile.traits.name
    ? `${profile.traits.name.first} ${profile.traits.name.last}`
    : "User"

  const initials = profile.traits.name
    ? `${profile.traits.name.first.charAt(0)}${profile.traits.name.last.charAt(0)}`.toUpperCase()
    : "U"

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown"

  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-background to-muted/20 p-8">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Avatar Section */}
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={session?.user?.image || ""} alt={fullName} />
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
              variant={profile.traits.role === "superadmin" ? "default" : "secondary"}
              className="w-fit"
            >
              <Shield className="h-3 w-3 mr-1" />
              {profile.traits.role === "superadmin" ? "Super Admin" : "User"}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{profile.traits.email}</span>
            </div>
            {profile.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Member since {memberSince}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
