import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, flowId } = await req.json()

    // Option 1: Using OpenAI directly (default)
    // Uncomment this section if you want to use OpenAI directly
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: 'You are a helpful AI assistant. Provide clear, concise, and friendly responses.',
    })

    return result.toTextStreamResponse()

    // Option 2: Integrate with Langflow
    // Uncomment this section and comment out the OpenAI section above
    // to integrate with your Langflow endpoint
    /*
    const langflowEndpoint = process.env.LANGFLOW_ENDPOINT
    const langflowApiKey = process.env.LANGFLOW_API_KEY

    if (!langflowEndpoint) {
      throw new Error('LANGFLOW_ENDPOINT not configured')
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]

    // Call Langflow API
    const langflowResponse = await fetch(`${langflowEndpoint}/api/v1/run/${flowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(langflowApiKey && { 'Authorization': `Bearer ${langflowApiKey}` })
      },
      body: JSON.stringify({
        input_value: lastMessage.content,
        output_type: 'chat',
        input_type: 'chat',
        tweaks: {}
      })
    })

    if (!langflowResponse.ok) {
      throw new Error(`Langflow API error: ${langflowResponse.statusText}`)
    }

    const langflowData = await langflowResponse.json()

    // Extract the response from Langflow
    // Adjust this based on your Langflow flow output structure
    const aiResponse = langflowData.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
                      langflowData.result ||
                      'No response from Langflow'

    // Return as a streaming response
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [{ role: 'assistant', content: aiResponse }],
    })

    return result.toTextStreamResponse()
    */
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
