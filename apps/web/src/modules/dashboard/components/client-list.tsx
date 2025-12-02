import type { OAuth2Client } from "@/types/oauth-client.types"
import { ClientCard } from "./client-card"

export function ClientsList({ clients }: { clients: OAuth2Client[] }) {
  if (!Array.isArray(clients)) {
    return <div>Error fetching clients</div>
  }
  return (
    <div className="grid gap-4">
      {clients.map((client) => (
        <ClientCard key={client.client_id} client={client} />
      ))}
    </div>
  )
}
