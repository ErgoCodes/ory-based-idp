import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import type { ConsentRequestInfo } from "@repo/api"

interface ConsentHeaderProps {
  consentRequest: ConsentRequestInfo
}

export function ConsentHeader({ consentRequest }: ConsentHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="text-2xl">Grant Access</CardTitle>
      <CardDescription className="text-sm">
        <span className="font-medium">{consentRequest.client.client_name}</span> is requesting
        access to your account
      </CardDescription>
      <p className="text-xs text-muted-foreground mt-2">
        User: <span className="font-medium">{consentRequest.subject}</span>
      </p>
    </CardHeader>
  )
}
