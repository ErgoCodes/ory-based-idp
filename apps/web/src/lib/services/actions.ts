"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-config"
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

/**
 * Fetch all users from the admin API
 * Requires superadmin role
 */
export async function getUsers(): Promise<UserProfile[]> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "superadmin") {
    redirect("/dashboard")
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        redirect("/login")
      }
      throw new Error("Failed to fetch users")
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

/**
 * Delete a user by ID
 * Requires superadmin role
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { success: false, error: "Not authenticated" }
  }

  if (session.user.role !== "superadmin") {
    return { success: false, error: "Unauthorized" }
  }

  // Prevent self-deletion
  if (userId === session.user.id) {
    return { success: false, error: "Cannot delete your own account" }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { success: false, error: "Unauthorized" }
      }
      throw new Error("Failed to delete user")
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
