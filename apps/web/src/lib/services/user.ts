"use server"

import { fetchWithAuthServer } from "@/lib/api/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

export interface UserUpdateData {
  name: {
    first: string
    last: string
  }
  email: string
  role: "user" | "superadmin"
}

export async function updateUserAction(userId: string, data: UserUpdateData) {
  try {
    const response = await fetchWithAuthServer(`/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error?.message || "Failed to update user",
      }
    }

    revalidatePath(`/dashboard/users/${userId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    }
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const response = await fetchWithAuthServer(`/admin/users/${userId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to delete user",
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    }
  }

  revalidatePath("/dashboard/users")
  redirect("/dashboard/users")
}

export async function getUser(id: string) {
  try {
    const response = await fetchWithAuthServer(`/admin/users/${id}`)

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error("Failed to fetch user")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}
