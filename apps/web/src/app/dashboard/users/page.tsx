import { AuthGuard } from "@/components/auth-guard"
import { UsersContainer } from "@/modules/dashboard/modules/users/containers/users-container"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-config"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  // Enforce role-based access at server level
  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "superadmin") {
    redirect("/dashboard")
  }

  return (
    <AuthGuard>
      <UsersContainer />
    </AuthGuard>
  )
}
