"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export function ProfileHeader() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
    </div>
  )
}
