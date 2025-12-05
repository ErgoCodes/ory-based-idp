import type { OAuth2Client } from "@/types/oauth-client.types"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { ClientActions } from "./client-actions"
import { CopyButton } from "./copy-button"

/**
 * Props interface for the ClientCard component
 */
export interface ClientCardProps {
  client: OAuth2Client
}

/**
 * Truncates a string to a specified length and adds ellipsis
 */
function truncateString(str: string, maxLength: number = 40): string {
  if (str.length <= maxLength) return str
  const start = str.substring(0, 8)
  const end = str.substring(str.length - 8)
  return `${start}...${end}`
}

/**
 * Server Component: Displays OAuth2 Client information in a card format
 * Optimized for server-side rendering with client-only interactivity isolated
 */
export function ClientCard({ client }: ClientCardProps) {
  const truncatedClientId = truncateString(client.client_id, 20)

  return (
    <Card
      className="
        transition-all duration-200
        border border-border/70
        bg-card
        hover:shadow-lg
        hover:border-border
        hover:bg-card/95
        rounded-xl
      "
    >
      <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0">
        <div className="space-y-2 flex-1 min-w-0">
          {/* Client Name */}
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
            {client.client_name}
          </CardTitle>

          {/* Client ID with Copy Button */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardDescription className="font-mono text-xs text-muted-foreground/80 cursor-help">
                    {truncatedClientId}
                  </CardDescription>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[400px]">
                  <p className="font-mono text-xs break-all">{client.client_id}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CopyButton value={client.client_id} label="Copy Client ID" />
          </div>
        </div>

        {/* Actions Menu (Client Component) */}
        <ClientActions clientId={client.client_id} clientName={client.client_name} />
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Redirect URIs Section */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
            Redirect URIs
          </h4>
          <div className="flex flex-wrap gap-2">
            {client.redirect_uris.length > 0 ? (
              client.redirect_uris.map((uri) => (
                <TooltipProvider key={uri}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="
                          font-mono text-xs px-3 py-1
                          rounded-md
                          bg-secondary/60
                          text-secondary-foreground
                          hover:bg-secondary/80
                          transition-colors
                          cursor-help
                          max-w-[300px]
                          truncate
                        "
                      >
                        {uri}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[500px]">
                      <p className="font-mono text-xs break-all">{uri}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">
                No redirect URIs configured
              </span>
            )}
          </div>
        </div>

        {/* Grant Types & Scopes - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Grant Types */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Grant Types
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {client.grant_types.length > 0 ? (
                client.grant_types.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="
                      text-[11px] px-2.5 py-0.5 rounded-md
                      border-border/70
                      text-foreground/90
                      bg-primary
                      hover:bg-accent/50
                      transition-colors
                      font-medium
                    "
                  >
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No grant types</span>
              )}
            </div>
          </div>

          {/* Scopes */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Scopes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {client.scope && client.scope.trim() ? (
                client.scope
                  .split(" ")
                  .filter(Boolean)
                  .map((scope) => (
                    <Badge
                      key={scope}
                      variant="outline"
                      className="
                      text-[11px] px-2.5 py-0.5 rounded-md
                      border-border/70
                      text-foreground/90
                      bg-primary
                      hover:bg-accent/50
                      transition-colors
                      font-medium
                    "
                    >
                      {scope}
                    </Badge>
                  ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No scopes defined</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
