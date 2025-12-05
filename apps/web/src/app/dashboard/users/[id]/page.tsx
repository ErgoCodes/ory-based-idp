import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-config"

import { UserDetailsView } from "../../../../modules/dashboard/modules/users/components/user-details-view"
import { getUser } from "@/lib/services/user"

interface UserDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "superadmin") {
    redirect("/dashboard")
  }

  const user = await getUser(id)

  if (!user) {
    notFound()
  }

  return (
    <>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Suspense fallback={<div>Loading...</div>}>
          <UserDetailsView user={user} currentUserId={session.user.id} />
        </Suspense>
      </main>
    </>
  )
}
