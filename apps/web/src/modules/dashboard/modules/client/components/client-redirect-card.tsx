import type { OAuth2Client } from "@/types/oauth-client.types"
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"

export function ClientRedirectsCard({ client }: { client: OAuth2Client }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redirect URIs</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {client.redirect_uris.map((uri, i) => (
          <div key={i} className="px-3 py-2 bg-muted rounded text-sm font-mono">
            {uri}
          </div>
        ))}

        {client.post_logout_redirect_uris?.length ? (
          <>
            <h3 className="text-sm font-medium mt-4">Post Logout Redirect URIs</h3>
            {client.post_logout_redirect_uris.map((uri, i) => (
              <div key={i} className="px-3 py-2 bg-muted rounded text-sm font-mono">
                {uri}
              </div>
            ))}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
