"use server"

import { revalidatePath } from "next/cache"
import { fetchWithAuthServer } from "@/lib/api/client"
import { z } from "zod"

const deleteClientSchema = z.object({
  clientId: z.string().min(1),
})

export type DeleteClientState = {
  success?: boolean
  error?: string
}

export async function deleteClient(
  prevState: DeleteClientState | null,
  formData: FormData,
): Promise<DeleteClientState> {
  const clientId = formData.get("clientId")

  const result = deleteClientSchema.safeParse({ clientId })

  if (!result.success) {
    return { error: "Invalid client ID" }
  }

  try {
    const response = await fetchWithAuthServer(`/oauth2/clients/${result.data.clientId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete client")
    }

    revalidatePath("/dashboard/clients")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete client:", error)
    return { error: "Failed to delete client. Please try again." }
  }
}
