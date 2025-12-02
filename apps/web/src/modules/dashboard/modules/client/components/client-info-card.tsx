import type { OAuth2Client } from "@/types/oauth-client.types"
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"
import { CopyClientIdButton } from "./copy-client-id"

export function ClientInfoCard({ client }: { client: OAuth2Client }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Client ID</p>
          <div className="flex gap-2">
            <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm break-all">
              {client.client_id}
            </code>
            <CopyClientIdButton value={client.client_id} />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Client Name</p>
          <p className="mt-1 px-3 py-2 bg-muted rounded">{client.client_name}</p>
        </div>

        <div>
          <p className="text-sm font-medium">Auth Method</p>
          <p className="mt-1 px-3 py-2 bg-muted rounded">{client.token_endpoint_auth_method}</p>
        </div>
      </CardContent>
    </Card>
  )
}
