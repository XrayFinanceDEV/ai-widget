// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, flowId } = await req.json()

    // Integrate with Langflow
    const langflowEndpoint = process.env.LANGFLOW_ENDPOINT
    const langflowApiKey = process.env.LANGFLOW_API_KEY

    if (!langflowEndpoint) {
      throw new Error('LANGFLOW_ENDPOINT not configured')
    }

    if (!flowId) {
      throw new Error('Flow ID is required')
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const inputValue = lastMessage.content || lastMessage.parts?.find((p: any) => p.type === 'text')?.text || ''

    // Generate session ID for conversation continuity
    const sessionId = crypto.randomUUID()

    // Call Langflow API (matches working example from Langflow)
    const payload = {
      output_type: 'chat',
      input_type: 'chat',
      input_value: inputValue,
      session_id: sessionId
    }

    const langflowResponse = await fetch(`${langflowEndpoint}/api/v1/run/${flowId}?stream=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(langflowApiKey && { 'x-api-key': langflowApiKey })
      },
      body: JSON.stringify(payload)
    })

    if (!langflowResponse.ok) {
      const errorText = await langflowResponse.text()
      throw new Error(`Langflow API error: ${langflowResponse.statusText} - ${errorText}`)
    }

    // Stream the response directly to the client
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = langflowResponse.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          controller.close()
          return
        }

        // Helper function to add delay for natural typing effect
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

        try {
          let buffer = ''
          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            console.log('Raw chunk from Langflow:', chunk)
            buffer += chunk
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              console.log('Processing line:', line)
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data)
                  console.log('Parsed stream data:', parsed)
                  // Extract token from Langflow streaming format
                  const token = parsed.chunk || parsed.token || parsed.message || ''
                  if (token) {
                    console.log('Sending token:', token)
                    controller.enqueue(encoder.encode(token))
                    await delay(50) // 50ms delay between chunks
                  }
                } catch (e) {
                  console.error('Error parsing stream data:', data, e)
                }
              } else if (line.trim()) {
                // Try parsing non-SSE format
                try {
                  const parsed = JSON.parse(line)
                  console.log('Parsed non-SSE data:', parsed)

                  // Handle Langflow token events
                  if (parsed.event === 'token' && parsed.data?.chunk) {
                    const token = parsed.data.chunk
                    console.log('Sending token:', token)
                    controller.enqueue(encoder.encode(token))
                    await delay(50) // 50ms delay between chunks for natural typing effect
                  }
                } catch (e) {
                  // Not JSON, might be plain text
                  console.log('Non-JSON line:', line)
                }
              }
            }
          }
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
