import type { OAuth2Client } from "@/types/oauth-client.types"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

export function ClientMetadataCard({ client }: { client: OAuth2Client }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created:</span>
          <span>{new Date(client.created_at ?? "").toLocaleString()}</span>
        </div>

        {client.updated_at && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated:</span>
            <span>{new Date(client.updated_at).toLocaleString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
