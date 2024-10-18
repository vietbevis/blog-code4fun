'use client'

import { useEffect, useRef } from 'react'

export default function GoogleAuthCallback({ searchParams }: { searchParams: { code: string } }) {
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const { code } = searchParams
    if (code) {
      window.opener?.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', code }, window.location.origin)
    }
    window.close()
  }, [searchParams])

  return null
}
