"use client"

import { Label } from "@workspace/ui/components/label"
import { Spinner } from "@workspace/ui/components/spinner"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen items-center justify-center">
      <div className="div-col items-center text-center gap-2">
        <Spinner />
        <Label>Loading...</Label>
      </div>
    </div>
  )
}
