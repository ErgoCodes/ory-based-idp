import type { OAuth2Client } from "@/types/oauth-client.types"
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

export function ClientOauthCard({ client }: { client: OAuth2Client }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OAuth2 Configuration</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-2">Grant Types</p>
          <div className="flex flex-wrap gap-2">
            {client.grant_types.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Response Types</p>
          <div className="flex flex-wrap gap-2">
            {client.response_types.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Scopes</p>
          <div className="flex flex-wrap gap-2">
            {client.scope.split(" ").map((scope) => (
              <Badge key={scope}>{scope}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
