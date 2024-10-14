'use client'

import { useEffect, useRef } from 'react'

export default function GoogleAuthCallback({ searchParams }: { searchParams: { code: string } }) {
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    const code = searchParams.code
    if (code) {
      window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', code }, window.location.origin)
    }
    ref.current = true
    window.close()
  }, [searchParams])

  return null
}
