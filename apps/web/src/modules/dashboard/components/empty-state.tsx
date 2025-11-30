import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import Link from "next/link"
type EmptyStateProps = {
  createLink: string
}
export function EmptyState({ createLink }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-card border rounded-lg">
      <p className="text-muted-foreground mb-4">No clients registered yet</p>
      <Button>
        <Link href={createLink} className="flex flex-row items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create your first client
        </Link>
      </Button>
    </div>
  )
}
