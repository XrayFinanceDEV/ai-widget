# AI Chat Widget for Langflow

A beautiful, production-ready chat widget for integrating Langflow AI agents into your Next.js applications. Features streaming responses, dark mode support, and a sleek UI built with shadcn/ui.

![AI Chat Widget](https://img.shields.io/badge/Next.js-16.0-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## Features

- ✨ Beautiful, modern UI with shadcn/ui components
- 🚀 Streaming AI responses with Vercel AI SDK
- 🔌 Easy integration with Langflow agents
- 🌙 Full dark mode support
- 📱 Fully responsive design
- ⚙️ Highly customizable
- 🎨 Non-modal slide-in panel
- ⌨️ Keyboard shortcuts (Enter to send, Escape to close)
- 💬 Quick action buttons
- 🔄 Real-time message streaming

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun
- OpenAI API key (or Langflow endpoint)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-widget
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# For OpenAI (default)
OPENAI_API_KEY=your_openai_api_key_here

# For Langflow integration
LANGFLOW_ENDPOINT=http://localhost:7860
LANGFLOW_API_KEY=your_langflow_api_key_here
LANGFLOW_FLOW_ID=your_flow_id_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the widget in action!

## Usage

### Basic Integration

Add the chat widget to any page:

```tsx
import { AIChatWidget } from '@/components/ai-chat-widget'

export default function Page() {
  return (
    <div>
      {/* Your page content */}

      <AIChatWidget
        title="AI Assistant"
        subtitle="Powered by Langflow"
        welcomeMessage="Hi! How can I help you today?"
        quickActions={[
          "What can you do?",
          "Tell me more",
          "Help me get started",
        ]}
      />
    </div>
  )
}
```

### Widget Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `flowId` | `string?` | `undefined` | Langflow flow ID |
| `apiEndpoint` | `string?` | `/api/chat` | API endpoint for chat |
| `welcomeMessage` | `string?` | `"Hi! Ask me anything."` | Initial greeting message |
| `quickActions` | `string[]?` | `["How can you help me?", ...]` | Quick action buttons |
| `title` | `string?` | `"AI Assistant"` | Widget title |
| `subtitle` | `string?` | `undefined` | Optional subtitle/badge |

## Langflow Integration

### Option 1: Using OpenAI Directly (Default)

The widget is pre-configured to use OpenAI. Just add your API key to `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

### Option 2: Integrating with Langflow

To connect to a Langflow agent:

1. Edit `app/api/chat/route.ts`
2. Comment out the OpenAI section
3. Uncomment the Langflow integration section
4. Update your `.env.local`:

```env
LANGFLOW_ENDPOINT=http://localhost:7860
LANGFLOW_API_KEY=your_api_key
LANGFLOW_FLOW_ID=your_flow_id
```

5. Pass the flow ID to the widget:

```tsx
<AIChatWidget
  flowId={process.env.NEXT_PUBLIC_LANGFLOW_FLOW_ID}
/>
```

### Langflow API Response Structure

The integration expects Langflow to return responses in this format:

```json
{
  "outputs": [{
    "outputs": [{
      "results": {
        "message": {
          "text": "AI response here"
        }
      }
    }]
  }]
}
```

Adjust the response parsing in `app/api/chat/route.ts` if your flow has a different structure.

## Customization

### Styling

The widget uses Tailwind CSS and shadcn/ui. Customize colors in:
- `app/globals.css` - CSS variables for theme colors
- `components/ai-chat-widget.tsx` - Component-specific styles

### Quick Actions

Customize the quick action buttons:

```tsx
<AIChatWidget
  quickActions={[
    "Tell me about product X",
    "How do I integrate?",
    "Pricing information",
  ]}
/>
```

### Custom API Endpoint

Use a custom API endpoint:

```tsx
<AIChatWidget
  apiEndpoint="/api/custom-chat"
/>
```

## Project Structure

```
ai-widget/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API route
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # shadcn/ui components
│   └── ai-chat-widget.tsx        # Main chat widget
├── lib/
│   └── utils.ts                  # Utilities
└── .env.local.example            # Environment variables template
```

## Key Features Explained

### Non-Modal Design

The chat opens as a slide-in panel without blocking page interaction:
- No dark overlay
- Page remains scrollable
- Users can interact with both chat and page content
- Set via `modal={false}` on the Sheet component

### Streaming Responses

Real-time AI responses stream token-by-token using Vercel AI SDK's `useChat` hook:
```tsx
const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
})
```

### Dark Mode

Automatic dark mode support using Tailwind's dark mode and CSS variables.

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Components

Use shadcn/ui CLI to add components:

```bash
npx shadcn@latest add <component-name>
```

## Troubleshooting

### Widget not appearing
- Check that `<AIChatWidget />` is added to your page
- Verify the component is imported correctly
- Check browser console for errors

### API errors
- Verify your API key is set in `.env.local`
- Check that the API endpoint is correct
- Review API route logs in terminal

### Streaming not working
- Ensure `maxDuration` is set in the API route
- Check that your API key has streaming enabled
- Verify network requests in browser DevTools

## License

MIT

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [Vercel AI SDK](https://ai-sdk.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Langflow](https://langflow.org)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
