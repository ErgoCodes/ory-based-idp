"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteUser } from "@/lib/services/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"

interface UserActionsProps {
  userId: string
  userEmail: string
  disabled?: boolean
}

export function UserActions({ userId, userEmail, disabled }: UserActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUser(userId)

      if (result.success) {
        toast.success("User deleted successfully")
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete user")
      }
    })
  }

  return (
    <div className="flex gap-2 ml-4">
      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/users/${userId}`)}>
        <Eye className="h-4 w-4" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled || isPending}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user <strong>{userEmail}</strong>? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
