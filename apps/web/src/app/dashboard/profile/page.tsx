import { Suspense } from "react"
import { getUserProfile } from "@/lib/services/user"
import { ProfileView } from "../../../modules/dashboard/modules/profile/containers/profile-view"
import { Loader2 } from "lucide-react"

export default async function ProfilePage() {
  const profile = await getUserProfile()

  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ProfileView initialProfile={profile} />
    </Suspense>
  )
}
