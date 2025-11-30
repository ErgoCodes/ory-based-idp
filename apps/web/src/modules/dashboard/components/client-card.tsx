"use client"

import { useRouter } from "next/navigation"
import { fetchWithAuth } from "@/lib/api/client"
import type { OAuth2Client } from "@/types/oauth-client.types"

import { Eye, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"

export function ClientCard({ client }: { client: OAuth2Client }) {
  const router = useRouter()

  const handleDeleteClient = async (clientId: string) => {
    try {
      const response = await fetchWithAuth(`/oauth2/clients/${clientId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete client")
    } catch {}
  }

  return (
    <Card className="hover:shadow-lg transition-all border-border/60">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <CardTitle className="text-lg font-semibold leading-tight">{client.client_name}</CardTitle>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/dashboard/clients/${client.client_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDeleteClient(client.client_id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="text-sm space-y-4">
        {/* Client ID */}
        <div className="grid gap-1">
          <span className="text-muted-foreground">Client ID:</span>
          <code className="px-2 py-1 bg-muted rounded text-xs w-fit">{client.client_id}</code>
        </div>

        {/* Redirect URIs */}
        <div className="grid gap-1">
          <span className="text-muted-foreground">Redirect URIs:</span>
          <div className="space-y-1">
            {client.redirect_uris.map((uri, idx) => (
              <code key={idx} className="block px-2 py-1 bg-muted rounded text-xs w-fit">
                {uri}
              </code>
            ))}
          </div>
        </div>

        {/* Grant Types */}
        <div className="grid gap-1">
          <span className="text-muted-foreground">Grant Types:</span>
          <span className="text-primary font-medium">{client.grant_types.join(", ")}</span>
        </div>

        {/* Scopes */}
        <div className="grid gap-1">
          <span className="text-muted-foreground">Scopes:</span>
          <span>{client.scope}</span>
        </div>
      </CardContent>
    </Card>
  )
}
