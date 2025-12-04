import type { OAuth2Client } from "@/types/oauth-client.types"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { ClientActions } from "./client-actions"

export function ClientCard({ client }: { client: OAuth2Client }) {
  return (
    <Card
      className="
        transition-all
        border border-border/70
        bg-card
        hover:shadow-md
        hover:bg-card/80
        rounded-xl
      "
    >
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold tracking-tight text-foreground">
            {client.client_name}
          </CardTitle>

          <CardDescription
            className="font-mono text-xs truncate max-w-[300px] text-muted-foreground/70"
            title={client.client_id}
          >
            {client.client_id}
          </CardDescription>
        </div>

        <ClientActions clientId={client.client_id} clientName={client.client_name} />
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Redirect URIs */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground tracking-wide">
            REDIRECT URIS
          </div>
          <div className="flex flex-wrap gap-2">
            {client.redirect_uris.map((uri) => (
              <Badge
                key={uri}
                variant="secondary"
                className="
                  font-mono text-xs px-2 py-0.5
                  rounded-md
                  bg-muted/40
                  text-muted-foreground
                "
              >
                {uri}
              </Badge>
            ))}
          </div>
        </div>

        {/* Grant Types + Scopes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground tracking-wide">
              GRANT TYPES
            </div>
            <div className="flex flex-wrap gap-1.5">
              {client.grant_types.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="
                    text-[10px] px-2 py-0.5 rounded-md
                    border-border/60
                    text-foreground/80
                  "
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground tracking-wide">SCOPES</div>
            <div className="flex flex-wrap gap-1.5">
              {client.scope.split(" ").map((scope) => (
                <Badge
                  key={scope}
                  variant="outline"
                  className="
                    text-[10px] px-2 py-0.5 rounded-md
                    border-border/60
                    text-foreground/80
                  "
                >
                  {scope}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
