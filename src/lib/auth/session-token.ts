import type { AuthSession } from "@/providers/auth/types"
import type { ResolvedRole } from "@/providers/auth/resolvers/role.resolver"

export const SESSION_COOKIE = "stms.session-token"

export type SessionCookiePayload = {
  session: AuthSession
  appRole: ResolvedRole | null
}

function b64url(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function decodeB64url(input: string): Uint8Array<ArrayBuffer> {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function signingKeySecret(): string {
  return process.env.AUTH_SECRET ?? "stms-dev-session-secret"
}

async function signingKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(signingKeySecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

async function signPayload(payload: string): Promise<string> {
  const key = await signingKey()
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  return b64url(new Uint8Array(signature))
}

async function verifyPayload(payload: string, signature: string): Promise<boolean> {
  try {
    const key = await signingKey()
    return await crypto.subtle.verify(
      "HMAC",
      key,
      decodeB64url(signature),
      new TextEncoder().encode(payload)
    )
  } catch {
    return false
  }
}

export async function encodeSessionCookie(payload: SessionCookiePayload): Promise<string> {
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)))
  const signature = await signPayload(body)
  return `${body}.${signature}`
}

export async function decodeSessionCookie(value: string): Promise<SessionCookiePayload | null> {
  const separator = value.lastIndexOf(".")
  if (separator === -1) return null

  const body = value.slice(0, separator)
  const signature = value.slice(separator + 1)

  const valid = await verifyPayload(body, signature)
  if (!valid) return null

  try {
    const json = new TextDecoder().decode(decodeB64url(body))
    const parsed = JSON.parse(json) as SessionCookiePayload
    if (!parsed?.session?.user?.id || typeof parsed.session.accessToken !== "string") return null
    return parsed
  } catch {
    return null
  }
}
