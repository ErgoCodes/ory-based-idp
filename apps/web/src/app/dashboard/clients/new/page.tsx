import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"
import { CreateClientView } from "@/modules/dashboard/modules/client/containers/create-client-view"

export default async function NewClientPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user?.role !== "superadmin") {
    redirect("/dashboard")
  }

  return <CreateClientView />
}
