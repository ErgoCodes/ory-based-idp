import type { OAuth2Client } from "@/types/oauth-client.types"
import { ClientCard } from "./client-card"
import { fetchWithAuthServer } from "@/lib/api/client"

export function ClientsList({ clients }: { clients: OAuth2Client[] }) {
  return (
    <div className="grid gap-4">
      {clients.map((client) => (
        <ClientCard key={client.client_id} client={client} />
      ))}
    </div>
  )
}
