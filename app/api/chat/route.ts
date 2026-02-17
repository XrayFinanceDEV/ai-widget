import { cookies } from 'next/headers'

// Allow up to 30 seconds for the AI response
export const maxDuration = 30

const SESSION_COOKIE = 'open_notebook_session'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get open-notebook configuration from env
    const endpoint    = process.env.OPEN_NOTEBOOK_ENDPOINT
    const notebookId  = process.env.OPEN_NOTEBOOK_NOTEBOOK_ID
    const chatModel   = process.env.OPEN_NOTEBOOK_CHAT_MODEL

    if (!endpoint)   throw new Error('OPEN_NOTEBOOK_ENDPOINT not configured')
    if (!notebookId) throw new Error('OPEN_NOTEBOOK_NOTEBOOK_ID not configured')
    if (!chatModel)  throw new Error('OPEN_NOTEBOOK_CHAT_MODEL not configured')

    // Extract the last user message
    const lastMessage = messages[messages.length - 1]
    const question = lastMessage?.content ?? ''
    if (!question) throw new Error('No question provided')

    // ── 1. Get or create chat session ──────────────────────────────────────
    const cookieStore = await cookies()
    let sessionId = cookieStore.get(SESSION_COOKIE)?.value

    if (!sessionId) {
      const res = await fetch(`${endpoint}/api/chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notebook_id: notebookId,
          title: 'Widget Chat',
          model_override: chatModel,
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Failed to create session: ${res.status} ${err}`)
      }
      const data = await res.json()
      sessionId = data.id as string

      cookieStore.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',   // needed for cross-site iframe embedding
        maxAge: 60 * 60 * 24,
      })
    }

    // ── 2. Fetch notebook context for RAG ──────────────────────────────────
    let context: { sources?: unknown[]; notes?: unknown[] } = {}
    try {
      const ctxRes = await fetch(`${endpoint}/api/notebooks/${notebookId}/context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notebook_id: notebookId }),
      })
      if (ctxRes.ok) {
        const ctxData = await ctxRes.json()
        context = { sources: ctxData.sources ?? [], notes: ctxData.notes ?? [] }
      }
    } catch (e) {
      console.warn('Could not fetch notebook context, continuing without RAG:', e)
    }

    // ── 3. Execute chat ────────────────────────────────────────────────────
    const chatRes = await fetch(`${endpoint}/api/chat/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        message: question,
        context,
        model_override: chatModel,
      }),
    })

    if (!chatRes.ok) {
      const err = await chatRes.text()
      throw new Error(`Chat execute failed: ${chatRes.status} ${err}`)
    }

    const chatData = await chatRes.json()

    // Extract the last AI message from the response
    const aiMessages = (chatData.messages ?? []).filter(
      (m: { type: string }) => m.type === 'ai'
    )
    const answer = aiMessages[aiMessages.length - 1]?.content ?? ''

    // Return as plain text — the client reads it with a stream reader
    return new Response(answer, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
