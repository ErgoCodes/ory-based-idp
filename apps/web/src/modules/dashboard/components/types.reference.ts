/**
 * TypeScript Interfaces for ClientCard Components
 *
 * This file documents all the TypeScript interfaces used in the ClientCard
 * component ecosystem for easy reference and type safety.
 */

// ============================================================================
// Main Component Props
// ============================================================================

/**
 * Props for the ClientCard component
 *
 * @example
 * ```tsx
 * <ClientCard client={oauthClient} />
 * ```
 */
export interface ClientCardProps {
  /** OAuth2 client data to display */
  client: OAuth2Client
}

// ============================================================================
// OAuth2 Client Type (from @/types/oauth-client.types)
// ============================================================================

/**
 * OAuth2 Client data structure
 * Represents an OAuth2 client application registered in the system
 */
export interface OAuth2Client {
  /** Unique client identifier */
  client_id: string

  /** Human-readable client name */
  client_name: string

  /** Client secret (optional, may not be returned in all contexts) */
  client_secret?: string

  /** List of allowed redirect URIs for OAuth2 flows */
  redirect_uris: string[]

  /** List of allowed post-logout redirect URIs */
  post_logout_redirect_uris?: string[]

  /** Allowed OAuth2 grant types (e.g., "authorization_code", "refresh_token") */
  grant_types: string[]

  /** Allowed OAuth2 response types (e.g., "code", "token") */
  response_types: string[]

  /** Space-separated list of OAuth2 scopes */
  scope: string

  /** Token endpoint authentication method */
  token_endpoint_auth_method: string

  /** ISO 8601 timestamp of client creation */
  created_at?: string

  /** ISO 8601 timestamp of last update */
  updated_at?: string
}

// ============================================================================
// CopyButton Props
// ============================================================================

/**
 * Props for the CopyButton component
 *
 * @example
 * ```tsx
 * <CopyButton value="client-id-123" label="Copy Client ID" />
 * ```
 */
export interface CopyButtonProps {
  /** The text value to copy to clipboard */
  value: string

  /** Optional tooltip label (defaults to "Copy to clipboard") */
  label?: string
}

// ============================================================================
// ClientActions Props (existing component)
// ============================================================================

/**
 * Props for the ClientActions dropdown menu component
 *
 * @example
 * ```tsx
 * <ClientActions clientId="abc123" clientName="My App" />
 * ```
 */
export interface ClientActionsProps {
  /** Client ID for actions (view, delete) */
  clientId: string

  /** Client name for display in confirmation dialogs */
  clientName: string
}

// ============================================================================
// Utility Function Types
// ============================================================================

/**
 * Truncates a string to a specified length with smart ellipsis
 * Shows first 8 and last 8 characters for IDs
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation (default: 40)
 * @returns Truncated string with ellipsis or original if under maxLength
 *
 * @example
 * ```ts
 * truncateString("058c1234-5678-90ab-cdef-1234567890ab", 20)
 * // Returns: "058c1234...567890ab"
 * ```
 */
export type TruncateStringFn = (str: string, maxLength?: number) => string

// ============================================================================
// Component Composition Diagram
// ============================================================================

/**
 * Component Hierarchy:
 *
 * ClientCard (Server Component)
 * ├── Card (Shadcn UI)
 * │   ├── CardHeader
 * │   │   ├── CardTitle (Client Name)
 * │   │   ├── CardDescription (Client ID)
 * │   │   │   └── Tooltip (Full Client ID)
 * │   │   ├── CopyButton (Client Component) ⚡
 * │   │   └── ClientActions (Client Component) ⚡
 * │   └── CardContent
 * │       ├── Redirect URIs Section
 * │       │   └── Badge[] with Tooltips
 * │       └── Grid (Grant Types | Scopes)
 * │           ├── Grant Types Section
 * │           │   └── Badge[]
 * │           └── Scopes Section
 * │               └── Badge[]
 *
 * ⚡ = Client Component (uses 'use client')
 * All other components are Server Components
 */

// ============================================================================
// State Management Types
// ============================================================================

/**
 * Internal state for CopyButton component
 */
export interface CopyButtonState {
  /** Whether the copy action was successful and showing feedback */
  copied: boolean
}

/**
 * Internal state for ClientActions component
 */
export interface ClientActionsState {
  /** Whether the delete confirmation dialog is visible */
  showDeleteDialog: boolean
}

// ============================================================================
// Event Handler Types
// ============================================================================

/**
 * Handler for copy button click
 */
export type HandleCopyFn = () => Promise<void>

/**
 * Handler for opening delete dialog
 */
export type HandleDeleteFn = () => void

// ============================================================================
// Shadcn UI Component Props (for reference)
// ============================================================================

/**
 * Badge variant options used in ClientCard
 */
export type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

/**
 * Tooltip side positioning options
 */
export type TooltipSide = "top" | "right" | "bottom" | "left"

/**
 * Button size options used in CopyButton
 */
export type ButtonSize = "default" | "sm" | "lg" | "icon"

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example 1: Basic Usage
 * ```tsx
 * import { ClientCard } from "@/modules/dashboard/components/client-card"
 * import type { OAuth2Client } from "@/types/oauth-client.types"
 *
 * const client: OAuth2Client = {
 *   client_id: "058c1234-5678-90ab-cdef-1234567890ab",
 *   client_name: "My Application",
 *   redirect_uris: ["https://example.com/callback"],
 *   grant_types: ["authorization_code", "refresh_token"],
 *   response_types: ["code"],
 *   scope: "openid profile email",
 *   token_endpoint_auth_method: "client_secret_basic"
 * }
 *
 * export default function ClientsPage() {
 *   return <ClientCard client={client} />
 * }
 * ```
 *
 * Example 2: In a Grid Layout
 * ```tsx
 * import { ClientCard } from "@/modules/dashboard/components/client-card"
 *
 * export default async function ClientsPage() {
 *   const clients = await fetchClients()
 *
 *   return (
 *     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
 *       {clients.map((client) => (
 *         <ClientCard key={client.client_id} client={client} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * Example 3: Using CopyButton Standalone
 * ```tsx
 * import { CopyButton } from "@/modules/dashboard/components/copy-button"
 *
 * export function ClientSecret({ secret }: { secret: string }) {
 *   return (
 *     <div className="flex items-center gap-2">
 *       <code className="font-mono text-sm">{secret}</code>
 *       <CopyButton value={secret} label="Copy Client Secret" />
 *     </div>
 *   )
 * }
 * ```
 */
