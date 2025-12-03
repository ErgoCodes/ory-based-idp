import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"

interface UserProfile {
  id: string
  traits: {
    email: string
    name?: {
      first: string
      last: string
    }
    role: "user" | "superadmin"
  }
  created_at?: string
  updated_at?: string
}

interface UserInfoProps {
  user: UserProfile
  onEdit: () => void
}

export function UserInfo({ user, onEdit }: UserInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Information</CardTitle>
            <CardDescription>View and manage user details</CardDescription>
          </div>
          <Button onClick={onEdit}>Edit User</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Full Name</Label>
              <p className="font-medium">
                {user.traits.name
                  ? `${user.traits.name.first} ${user.traits.name.last}`
                  : "Not set"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user.traits.email}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Role</Label>
              <div>
                <Badge variant={user.traits.role === "superadmin" ? "default" : "secondary"}>
                  {user.traits.role}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">User ID</Label>
              <p className="font-mono text-sm text-muted-foreground">{user.id}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {user.created_at && (
              <div className="space-y-1">
                <Label className="text-muted-foreground">Created At</Label>
                <p>{new Date(user.created_at).toLocaleString()}</p>
              </div>
            )}
            {user.updated_at && (
              <div className="space-y-1">
                <Label className="text-muted-foreground">Last Updated</Label>
                <p>{new Date(user.updated_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
