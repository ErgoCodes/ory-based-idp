"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import { AlertCircle, Check, X } from "lucide-react"
import { toast } from "sonner"
import type { ConsentRequestInfo } from "@repo/api"
import { acceptConsent, rejectConsent } from "@/modules/auth/oauth2/actions"

interface ConsentCardProps {
  consentRequest: ConsentRequestInfo
  consentChallenge: string
}

export function ConsentCard({ consentRequest, consentChallenge }: ConsentCardProps) {
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setLoading(true)
    try {
      const result = await acceptConsent(consentChallenge, remember, consentRequest.requested_scope)

      if (!result.success && result.error) {
        toast.error(result.error)
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    setLoading(true)
    try {
      const result = await rejectConsent(consentChallenge)

      if (!result.success && result.error) {
        toast.error(result.error)
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Grant Access</CardTitle>
        <CardDescription>
          <span className="font-medium text-foreground">{consentRequest.client.client_name}</span>{" "}
          is requesting access to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            User: <span className="font-medium text-foreground">{consentRequest.subject}</span>
          </p>
        </div>

        {consentRequest.requested_scope.length > 0 && (
          <div className="rounded-md bg-muted p-4">
            <p className="mb-2 text-sm font-medium">This application will be able to:</p>
            <ul className="space-y-2">
              {consentRequest.requested_scope.map((scope) => (
                <li key={scope} className="flex items-start text-sm">
                  <Check className="mr-2 h-4 w-4 text-primary shrink-0" />
                  <span>{scope}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked as boolean)}
            disabled={loading}
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember my decision
          </Label>
        </div>

        <Separator />

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={handleReject} disabled={loading}>
            <X className="mr-2 h-4 w-4" />
            Deny
          </Button>
          <Button className="flex-1" onClick={handleAccept} disabled={loading}>
            <Check className="mr-2 h-4 w-4" />
            {loading ? "Processing..." : "Grant Access"}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By granting access, you allow this application to access your information according to the
          permissions listed above.
        </p>
      </CardContent>
    </Card>
  )
}
