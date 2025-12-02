import type { OAuth2Client } from "@/types/oauth-client.types"
import { ClientActions } from "../components/client-actions"
import { ClientInfoCard } from "../components/client-info-card"
import { ClientMetadataCard } from "../components/client-metadata"
import { ClientOauthCard } from "../components/client-oauth-card"
import { ClientRedirectsCard } from "../components/client-redirect-card"

export function ClientDetails({ client }: { client: OAuth2Client }) {
  return (
    <div className="min-h-screen  bg-background flex flex-col">
      <main className="container mx-auto px-4 w-full  pt-10 pb-20 max-w-4xl space-y-8">
        <div className="mb-4 flex flex-row justify-between">
          <div className="">
            <h1 className="text-3xl font-bold">{client.client_name}</h1>
            <p className="text-muted-foreground">OAuth2 Client Details</p>
          </div>
          <ClientActions client={client} />
        </div>

        <ClientInfoCard client={client} />
        <ClientRedirectsCard client={client} />
        <ClientOauthCard client={client} />
        <ClientMetadataCard client={client} />
      </main>
    </div>
  )
}
