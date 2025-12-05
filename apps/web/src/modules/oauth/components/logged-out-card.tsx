"use client"

import { useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { CheckCircle2 } from "lucide-react"

export function LoggedOutCard() {
  useEffect(() => {
    // Auto-close window after a few seconds if opened in popup
    const timer = setTimeout(() => {
      if (window.opener) {
        window.close()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="w-full max-w-md border-green-200 bg-green-50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Logged Out Successfully</CardTitle>
        <CardDescription className="text-gray-600">
          You have been successfully logged out from all applications. Your session has been
          terminated and all tokens have been revoked.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-blue-50 p-4">
          <p className="text-xs text-blue-700">
            You can now safely close this window or navigate back to the application.
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This window will close automatically in a few seconds if opened as a popup.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
