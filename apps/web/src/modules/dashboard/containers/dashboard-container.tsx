import { fetchWithAuthServer } from "@/lib/api/client"
import LoadingScreen from "@/components/common/loading-screen"
import { ClientsList } from "../components/client-list"
import { ClientsListHeader } from "../components/clients-list-header"
import { EmptyState } from "../components/empty-state"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-config"

export async function DashboardView() {
  const session = await getServerSession(authOptions)
  const response = await fetchWithAuthServer("/oauth2/clients", {
    method: "GET",
  })
  const data = await response.json()

  if (session?.user?.role !== "superadmin") {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Welcome to your Dashboard</h2>
        <p className="text-muted-foreground mb-4">
          You can manage your profile and settings from here.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <ClientsListHeader total={data.length} />

      {data.error && (
        <div className="mb-6 p-4 border border-destructive bg-destructive/10 rounded-md">
          <p className="text-sm text-destructive">{data.error}</p>
        </div>
      )}

      {data.loading ? (
        <LoadingScreen />
      ) : data.length === 0 ? (
        <EmptyState createLink="/dashboard/clients/new" />
      ) : (
        <ClientsList clients={data ?? []} />
      )}
    </div>
  )
}
