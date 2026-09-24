"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type MediaUrlItem = {
  id: string
  url?: string | null
}

type SignedUrlLookup = {
  get: (id: string) => string | undefined
}

const SIGNED_URL_TTL_MS = 60 * 60 * 1000

type CacheEntry = {
  url: string
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<string | undefined>>()

async function fetchSignedUrl(id: string): Promise<string | undefined> {
  const pending = inflight.get(id)
  if (pending) return pending

  const promise = (async () => {
    try {
      const res = await fetch(`/api/media/private/${encodeURIComponent(id)}`)

      if (!res.ok) return undefined

      const json = await res.json()
      const url: unknown = json?.data?.signedUrl

      if (typeof url === "string" && url.length > 0) {
        cache.set(id, {
          url,
          expiresAt: Date.now() + SIGNED_URL_TTL_MS,
        })

        return url
      }

      return undefined
    } catch {
      return undefined
    } finally {
      inflight.delete(id)
    }
  })()

  inflight.set(id, promise)

  return promise
}

export function useMediaUrls(items: MediaUrlItem[]): SignedUrlLookup {
  const [, setVersion] = useState(0)

  const privateIds = items
    .filter((item) => !item.url)
    .map((item) => item.id)

  const idsKey = privateIds.join(",")
  const requestedRef = useRef<string | null>(null)

  useEffect(() => {
    if (idsKey === requestedRef.current) return

    requestedRef.current = idsKey

    const staleIds = privateIds.filter((id) => {
      const entry = cache.get(id)

      return !entry || entry.expiresAt < Date.now()
    })

    if (staleIds.length === 0) return

    void Promise.all(staleIds.map(fetchSignedUrl)).then(() => {
      setVersion((v) => v + 1)
    })
  }, [idsKey, privateIds])

  useEffect(() => {
    if (privateIds.length === 0) return

    const timer = setInterval(() => {
      setVersion((v) => v + 1)
    }, SIGNED_URL_TTL_MS)

    return () => clearInterval(timer)
  }, [privateIds.length, idsKey])

  const get = useCallback((id: string): string | undefined => {
    const entry = cache.get(id)

    return entry && entry.expiresAt >= Date.now()
      ? entry.url
      : undefined
  }, [])

  return { get }
}