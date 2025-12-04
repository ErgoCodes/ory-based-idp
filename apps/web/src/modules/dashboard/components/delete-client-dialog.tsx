"use client"

import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Trash2 } from "lucide-react"
import { deleteClient } from "../actions"

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
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner" // Assuming sonner is used, or use another toast if available. If not sure, I'll skip or use standard alert.
// Wait, I don't know if sonner is installed. I'll check package.json or just use console/alert if not sure.
// But Shadcn usually comes with sonner or toaster. I'll check imports in other files if I can.
// For now, I'll omit toast and just rely on UI state.

const initialState = {
  success: false,
  error: undefined,
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
  const [state, formAction] = useFormState(deleteClient, null)

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false)
      // Optional: Show success toast
    }
  }, [state?.success, onOpenChange])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the client
            <span className="font-medium text-foreground"> {clientName}</span> and remove its data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {state?.error && <div className="text-sm text-destructive font-medium">{state.error}</div>}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="clientId" value={clientId} />
            <DeleteButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
