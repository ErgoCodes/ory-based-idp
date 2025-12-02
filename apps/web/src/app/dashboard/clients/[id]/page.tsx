import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { fetchWithAuthServer } from "@/lib/api/client"
import { authOptions } from "@/lib/auth/auth-config"
import { ClientDetails } from "@/modules/dashboard/modules/client/containers/client-details-container"

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "superadmin") {
    redirect("/dashboard")
  }

  const response = await fetchWithAuthServer(`/oauth2/clients/${params.id}`)

  if (!response.ok) {
    return <div className="container py-12 text-destructive">Client not found</div>
  }

  const client = await response.json()

  return <ClientDetails client={client} />
}
