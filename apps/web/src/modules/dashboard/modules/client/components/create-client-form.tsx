"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { createClient } from "@/lib/services/client"
import { toast } from "sonner"
import RHFTextField from "@/components/common/rhf-text-field"

const clientSchema = z.object({
  client_name: z.string().min(1, "Client name is required"),
  redirect_uris: z.array(z.object({ value: z.string().url("Must be a valid URL") })),
  post_logout_redirect_uris: z.array(z.object({ value: z.string().url("Must be a valid URL") })),
  scope: z.string(),
  token_endpoint_auth_method: z.string(),
})

type ClientFormValues = z.infer<typeof clientSchema>

const defaultValues: ClientFormValues = {
  client_name: "",
  redirect_uris: [{ value: "" }],
  post_logout_redirect_uris: [{ value: "" }],
  scope: "openid email profile offline_access",
  token_endpoint_auth_method: "none",
}

export function CreateClientForm() {
  const router = useRouter()

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  })

  const {
    fields: redirectUriFields,
    append: appendRedirectUri,
    remove: removeRedirectUri,
  } = useFieldArray({
    control: form.control,
    name: "redirect_uris",
  })

  const {
    fields: postLogoutUriFields,
    append: appendPostLogoutUri,
    remove: removePostLogoutUri,
  } = useFieldArray({
    control: form.control,
    name: "post_logout_redirect_uris",
  })

  async function onSubmit(data: ClientFormValues) {
    try {
      // Filter out empty URIs and map to string array
      const cleanedData = {
        ...data,
        redirect_uris: data.redirect_uris
          .map((item) => item.value)
          .filter((uri) => uri.trim() !== ""),
        post_logout_redirect_uris: data.post_logout_redirect_uris
          .map((item) => item.value)
          .filter((uri) => uri.trim() !== ""),
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
      }

      if (cleanedData.redirect_uris.length === 0) {
        form.setError("redirect_uris", {
          type: "manual",
          message: "At least one redirect URI is required",
        })

        return
      }

      const result = await createClient(cleanedData)

      toast.success("Client created successfully")

      // Redirect to success page with client credentials
      const params = new URLSearchParams({
        client_id: result.client_id,
        client_name: result.client_name,
      })

      if (result.client_secret) {
        params.append("client_secret", result.client_secret)
      }

      router.push(`/dashboard/clients/success?${params.toString()}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create client")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-card p-6 border rounded-lg"
      >
        <RHFTextField
          name="client_name"
          label="Client Name"
          placeholder="My Application"
          disabled={form.formState.isSubmitting}
        />

        <div className="space-y-4">
          <FormLabel>Redirect URIs *</FormLabel>
          <FormDescription>
            URLs where users will be redirected after authentication
          </FormDescription>
          {redirectUriFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`redirect_uris.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="http://localhost:3001/callback"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {redirectUriFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeRedirectUri(index)}
                  disabled={form.formState.isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendRedirectUri({ value: "" })}
            disabled={form.formState.isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Redirect URI
          </Button>
          {form.formState.errors.redirect_uris?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.redirect_uris.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <FormLabel>Post Logout Redirect URIs</FormLabel>
          <FormDescription>URLs where users will be redirected after logout</FormDescription>
          {postLogoutUriFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`post_logout_redirect_uris.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="http://localhost:3000"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {postLogoutUriFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removePostLogoutUri(index)}
                  disabled={form.formState.isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendPostLogoutUri({ value: "" })}
            disabled={form.formState.isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Post Logout URI
          </Button>
        </div>

        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scopes</FormLabel>
              <FormControl>
                <Input placeholder="openid email profile" {...field} disabled />
              </FormControl>
              <FormDescription>Space-separated list of scopes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="token_endpoint_auth_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Endpoint Auth Method</FormLabel>
              <FormControl>
                <div className="relative">
                  <select
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  >
                    <option value="none">
                      None (Public Client with PKCE) - Recommended for SPAs
                    </option>
                    <option value="client_secret_basic">
                      Client Secret Basic - For Backend Servers
                    </option>
                  </select>
                </div>
              </FormControl>
              <FormDescription>
                Use PKCE for public clients (SPAs, mobile apps). Use Client Secret Basic for
                confidential clients (backend servers).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
            {form.formState.isSubmitting ? "Creating..." : "Create Client"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
