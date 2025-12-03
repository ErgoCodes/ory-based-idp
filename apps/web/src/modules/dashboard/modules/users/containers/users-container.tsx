import { getUsers, type UserProfile } from "@/lib/services/actions"
import { UsersHeader } from "../components/users-header"
import { UsersList } from "../components/users-list"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-config"

export async function UsersContainer() {
  let users: UserProfile[] = []
  let error: string | null = null

  try {
    users = await getUsers()
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load users"
  }

  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <UsersHeader userCount={users.length} />

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <UsersList users={users} currentUserId={session?.user?.id} />
      </main>
    </div>
  )
}
