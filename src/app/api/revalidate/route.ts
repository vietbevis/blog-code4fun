import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Credentials', 'true')
  headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
  headers.set('Access-Control-Allow-Methods', 'GET')
  headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization'
  )
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag!)
  return new NextResponse(JSON.stringify({ revalidated: true, now: Date.now() }), { headers })
}
