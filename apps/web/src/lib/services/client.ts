"use server"

import { fetchWithAuthServer } from "@/lib/api/client"
import { CreateOAuth2ClientRequest, OAuth2Client } from "@/types/oauth-client.types"
import { revalidatePath } from "next/cache"

export async function createClient(data: CreateOAuth2ClientRequest): Promise<OAuth2Client> {
  const response = await fetchWithAuthServer("/oauth2/clients", {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to create client")
  }

  revalidatePath("/dashboard/clients")
  return response.json()
}
