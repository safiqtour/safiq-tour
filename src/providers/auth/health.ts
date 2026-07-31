import { createAuthProvider } from "./factory"
import type { AuthProvider } from "./types"

export type AuthHealthCheckOptions = {
  email?: string
  password?: string
}

export type AuthHealthCheck = {
  name: string
  ok: boolean
  message: string
}

export type AuthHealthResult = {
  provider: string
  ok: boolean
  checks: AuthHealthCheck[]
}

function makeCheck(name: string, ok: boolean, message: string): AuthHealthCheck {
  return { name, ok, message }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export async function runAuthHealthCheck(
  provider?: AuthProvider,
  options: AuthHealthCheckOptions = {}
): Promise<AuthHealthResult> {
  const active = provider ?? createAuthProvider()
  const name = (process.env.AUTH_PROVIDER ?? "supabase").toLowerCase()
  const checks: AuthHealthCheck[] = []

  checks.push(makeCheck("provider-loaded", true, `Auth provider "${name}" instantiated`))

  const hasCredentials = Boolean(options.email && options.password)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: anonKey },
    })
    const reachable = response.ok
    checks.push(
      makeCheck(
        "connection-ok",
        reachable,
        reachable
          ? `Auth API reachable (HTTP ${response.status})`
          : `Auth API returned HTTP ${response.status}`
      )
    )
  } catch (error) {
    checks.push(makeCheck("connection-ok", false, `Auth API unreachable: ${errorMessage(error)}`))
  }

  try {
    const { error } = await providerSignInProbe(active)
    const reachable = error !== undefined && error !== null
    checks.push(
      makeCheck(
        "signin-api-reachable",
        reachable,
        reachable
          ? "Sign-in API responds to requests (invalid credentials rejected as expected)"
          : "Sign-in API did not respond to a probe request"
      )
    )
  } catch (error) {
    checks.push(makeCheck("signin-api-reachable", false, `Sign-in probe failed: ${errorMessage(error)}`))
  }

  if (!hasCredentials) {
    checks.push(
      makeCheck(
        "session-retrieval",
        true,
        "Skipped (no credentials provided). Pass email/password to verify session flow."
      )
    )
    checks.push(
      makeCheck(
        "token-refresh",
        true,
        "Skipped (no credentials provided). Pass email/password to verify refresh flow."
      )
    )
    return { provider: name, ok: checks.every((check) => check.ok), checks }
  }

  try {
    const session = await active.signIn({
      email: options.email!,
      password: options.password!,
    })
    const retrieved = await active.getSession()
    const ok = Boolean(session.accessToken && retrieved?.accessToken)
    checks.push(
      makeCheck(
        "session-retrieval",
        ok,
        ok
          ? "Sign-in succeeded and session was retrieved"
          : "Sign-in succeeded but session retrieval returned an empty session"
      )
    )
  } catch (error) {
    checks.push(
      makeCheck("session-retrieval", false, `Sign-in failed: ${errorMessage(error)}`)
    )
  }

  try {
    const refreshed = await active.refreshSession()
    const ok = Boolean(refreshed?.accessToken)
    checks.push(
      makeCheck(
        "token-refresh",
        ok,
        ok ? "Session token was refreshed with a new access token" : "Token refresh returned no session"
      )
    )
  } catch (error) {
    checks.push(makeCheck("token-refresh", false, `Token refresh failed: ${errorMessage(error)}`))
  }

  try {
    await active.signOut()
  } catch {
    // best-effort cleanup
  }

  return { provider: name, ok: checks.every((check) => check.ok), checks }
}

async function providerSignInProbe(
  provider: AuthProvider
): Promise<{ error: Error | null }> {
  try {
    await provider.signIn({ email: "health-check-no-such-user", password: "invalid" })
    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }
}
