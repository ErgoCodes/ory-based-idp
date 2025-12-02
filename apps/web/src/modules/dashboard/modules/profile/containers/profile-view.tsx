"use client"

import { type UserProfile } from "@/lib/services/user"
import { ProfileHeader } from "../components/profile-header"
import { PersonalInfoCard } from "../components/personal-info-card"
import { SecurityCard } from "../components/security-card"

interface ProfileViewProps {
  initialProfile: UserProfile
}

export function ProfileView({ initialProfile }: ProfileViewProps) {
  return (
    <div className="container max-w-4xl py-6 space-y-8 mx-auto">
      <ProfileHeader />

      <div className="grid gap-6">
        <PersonalInfoCard initialProfile={initialProfile} />
        <SecurityCard />
      </div>
    </div>
  )
}
