import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const endpoint = process.env.OPEN_NOTEBOOK_ENDPOINT

  if (!endpoint) {
    return Response.json({ error: 'OPEN_NOTEBOOK_ENDPOINT not configured' }, { status: 500 })
  }

  // Ensure the ID has the 'source:' prefix
  const sourceId = id.includes(':') ? id : `source:${id}`

  try {
    const resp = await fetch(`${endpoint}/api/sources/${encodeURIComponent(sourceId)}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await resp.json()
    return Response.json(data, { status: resp.status })
  } catch {
    return Response.json({ error: 'Failed to fetch source' }, { status: 500 })
  }
}
