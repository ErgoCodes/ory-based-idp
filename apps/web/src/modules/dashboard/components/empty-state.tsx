import { Button } from "@workspace/ui/components/button"
import { Shield, Plus, FileText } from "lucide-react"
import Link from "next/link"

type EmptyStateProps = {
  createLink: string
}

export function EmptyState({ createLink }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        {/* Icon with decorative background */}
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
        <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
          <Shield className="h-16 w-16 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-3 mb-6 max-w-md">
        <h3 className="text-2xl font-bold tracking-tight">No OAuth2 Clients Yet</h3>
        <p className="text-muted-foreground">
          Get started by creating your first OAuth2 client to enable secure authentication for your
          applications.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg">
          <Link href={createLink} className="gap-2">
            <Plus className="h-5 w-5" />
            Create Your First Client
          </Link>
        </Button>
      </div>
    </div>
  )
}
