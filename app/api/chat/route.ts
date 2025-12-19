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

    // Call Langflow API
    const langflowResponse = await fetch(`${langflowEndpoint}/api/v1/run/${flowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(langflowApiKey && { 'Authorization': `Bearer ${langflowApiKey}` })
      },
      body: JSON.stringify({
        output_type: 'chat',
        input_type: 'chat',
        input_value: inputValue,
        session_id: sessionId
      })
    })

    if (!langflowResponse.ok) {
      const errorText = await langflowResponse.text()
      throw new Error(`Langflow API error: ${langflowResponse.statusText} - ${errorText}`)
    }

    const langflowData = await langflowResponse.json()

    // Debug: Log the full Langflow response
    console.log('Langflow response:', JSON.stringify(langflowData, null, 2))

    // Extract the response from Langflow
    // Adjust this based on your Langflow flow output structure
    const aiResponse = langflowData.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
                      langflowData.result ||
                      'No response from Langflow'

    console.log('Extracted AI response:', aiResponse)

    // Return simple JSON response for the widget to handle
    return new Response(JSON.stringify({
      role: 'assistant',
      content: aiResponse,
      id: crypto.randomUUID()
    }), {
      headers: {
        'Content-Type': 'application/json',
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
