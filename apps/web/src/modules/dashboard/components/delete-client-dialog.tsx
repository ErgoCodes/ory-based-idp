"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { deleteClient } from "../../../lib/services/delete-client-actions"
import { useFormStatus } from "react-dom"

const initialState = {
  success: false,
  error: undefined as string | undefined,
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button variant="destructive" type="submit" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  )
}

export function DeleteClientDialog({
  clientId,
  clientName,
  open,
  onOpenChange,
}: {
  clientId: string
  clientName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  // ✅ Updated API
  const [state, formAction] = useActionState(deleteClient, initialState)

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false)
    }
  }, [state?.success, onOpenChange])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the client{" "}
            <span className="font-medium text-foreground">{clientName}</span> and remove its data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {state?.error && <div className="text-sm text-destructive font-medium">{state.error}</div>}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          {/* Form action properly triggers server action */}
          <form action={formAction}>
            <input type="hidden" name="clientId" value={clientId} />
            <DeleteButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
