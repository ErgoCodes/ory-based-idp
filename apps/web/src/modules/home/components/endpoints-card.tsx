import { Card, CardHeader, CardContent, CardTitle } from "@workspace/ui/components/card"

export default function EndpointsCard() {
  const endpoints = [
    { uri: "/oauth2/login", desc: "Login page" },
    { uri: "/oauth2/consent", desc: "Consent page" },
    { uri: "/oauth2/logout", desc: "Logout page" },
    { uri: "/dashboard", desc: "Admin dashboard" },
  ]

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Available endpoints</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 items-start flex flex-col">
          {endpoints.map((e) => (
            <li key={e.uri} className="text-sm text-muted-foreground">
              <code className="px-2 py-1 bg-muted rounded text-xs">{e.uri}</code> – {e.desc}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
