import { Card, CardContent } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { CopyCredential } from "./copy-credential"

interface CredentialCardProps {
  clientId: string
  clientSecret?: string
}

export function CredentialCard({ clientId, clientSecret }: CredentialCardProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label>Client ID</Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm">
              {clientId}
            </code>
            <CopyCredential value={clientId} />
          </div>
        </div>

        {clientSecret && (
          <div className="space-y-2">
            <Label>
              Client Secret <span className="ml-2 text-xs text-destructive">(Save this now!)</span>
            </Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-muted px-3 py-2 font-mono text-sm">
                {clientSecret}
              </code>
              <CopyCredential value={clientSecret} />
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            You can now use these credentials to configure your application to authenticate with
            this OAuth2 provider.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
