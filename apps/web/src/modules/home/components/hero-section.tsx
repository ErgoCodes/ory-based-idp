import { Label } from "@workspace/ui/components/label"

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center gap-4 max-w-xl">
      <Label className="text-4xl font-bold">OAuth2 Identity Provider</Label>
      <Label className="text-muted-foreground">
        This application provides login and consent screens for OAuth2/OIDC authentication, and
        allows administrators to manage OAuth2 clients and applications.
      </Label>
    </div>
  )
}
