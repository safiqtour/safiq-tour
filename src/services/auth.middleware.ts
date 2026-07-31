import { createAuthProvider } from "@/providers/auth/factory"
import type { AuthSession } from "@/providers/auth/types"

export { SESSION_COOKIE, encodeSessionCookie, decodeSessionCookie } from "@/lib/auth/session-token"

export async function verifySession(session?: AuthSession | null): Promise<boolean> {
  if (!session?.accessToken) return false

  const provider = createAuthProvider({
    sessionStore: {
      get: () => session,
      set: () => {},
    },
  })

  return provider.verifySession()
}
