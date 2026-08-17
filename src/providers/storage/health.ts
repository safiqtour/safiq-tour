import { createStorageProvider } from "./factory"
import type { StorageProvider } from "./types"

export type StorageHealthCheck = {
  name: string
  ok: boolean
  message: string
}

export type StorageHealthResult = {
  provider: string
  ok: boolean
  checks: StorageHealthCheck[]
}

function makeCheck(name: string, ok: boolean, message: string): StorageHealthCheck {
  return { name, ok, message }
}

export async function runStorageHealthCheck(
  provider?: StorageProvider,
  providerName?: string
): Promise<StorageHealthResult> {
  const active = provider ?? createStorageProvider()
  const name = (providerName ?? process.env.STORAGE_PROVIDER ?? "local").toLowerCase()
  const checks: StorageHealthCheck[] = []
  const testPath = `_health/${Date.now()}-${Math.random().toString(36).slice(2)}.txt`
  const payload = new Uint8Array(Buffer.from("storage-health-check"))

  checks.push(
    makeCheck("provider-loaded", true, `Storage provider "${name}" instantiated`)
  )

  try {
    await active.list("")
    checks.push(makeCheck("bucket-exists", true, "Storage bucket/root is reachable"))
  } catch (error) {
    checks.push(
      makeCheck("bucket-exists", false, `Bucket/root unreachable: ${errorMessage(error)}`)
    )
  }

  try {
    await active.upload(payload, testPath)
    const uploaded = await active.exists(testPath)
    checks.push(
      makeCheck(
        "upload-test",
        uploaded,
        uploaded ? "Upload succeeded and file is present" : "Upload reported success but file is missing"
      )
    )
  } catch (error) {
    checks.push(makeCheck("upload-test", false, `Upload failed: ${errorMessage(error)}`))
  }

  try {
    const publicUrl = active.getPublicUrl(testPath)
    const signedUrl = await active.createSignedUrl(testPath, 60)
    const valid = publicUrl.length > 0 && signedUrl.length > 0
    checks.push(
      makeCheck(
        "public-url",
        valid,
        valid
          ? `Public URL and signed URL generated (${publicUrl})`
          : "Public URL or signed URL generation returned an empty value"
      )
    )
  } catch (error) {
    checks.push(
      makeCheck("public-url", false, `URL generation failed: ${errorMessage(error)}`)
    )
  }

  try {
    await active.delete(testPath)
    const removed = !(await active.exists(testPath))
    checks.push(
      makeCheck(
        "delete-test",
        removed,
        removed ? "Delete succeeded and file is removed" : "Delete reported success but file still exists"
      )
    )
  } catch (error) {
    checks.push(makeCheck("delete-test", false, `Delete failed: ${errorMessage(error)}`))
  }

  try {
    await active.deleteFolder("_health")
  } catch {
    // best-effort cleanup
  }

  const ok = checks.every((check) => check.ok)
  return { provider: name, ok, checks }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
