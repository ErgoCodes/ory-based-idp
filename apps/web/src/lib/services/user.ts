"use server"

import { fetchWithAuthServer } from "@/lib/api/client"
import { revalidatePath } from "next/cache"

export interface UserProfile {
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
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await fetchWithAuthServer("/users/me")

  if (!response.ok) {
    throw new Error("Failed to fetch profile")
  }

  return response.json()
}

export async function updateUserProfile(data: {
  name: { first: string; last: string }
  email: string
}) {
  const response = await fetchWithAuthServer("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error?.message || "Failed to update profile")
  }

  revalidatePath("/dashboard/profile")
  return response.json()
}

export async function changeUserPassword(data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  const response = await fetchWithAuthServer("/users/me/password", {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.log(errorData)
    throw new Error(errorData.error?.message || "Failed to change password")
  }

  return response.json()
}
