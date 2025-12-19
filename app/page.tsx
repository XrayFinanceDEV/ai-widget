import { AIChatWidget } from '@/components/ai-chat-widget'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="font-bold text-xl">AI Chat Widget</span>
          </div>
          <nav className="flex gap-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </a>
            <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
              🚀 Built with Next.js + Vercel AI SDK + Langflow
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Beautiful AI Chat Widget
              <br />
              <span className="text-blue-600">for Langflow Agents</span>
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground">
              A production-ready, customizable chat widget that integrates seamlessly with Langflow agents.
              Features streaming responses, dark mode, and a beautiful UI inspired by modern design.
            </p>

            <div className="flex gap-4">
              <button className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                Get Started
              </button>
              <button className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                View on GitHub
              </button>
            </div>
          </div>
        </section>

        <section id="features" className="container py-24 border-t">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Features
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 p-6 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold">Beautiful UI</h3>
                <p className="text-sm text-muted-foreground">
                  Modern, responsive design with shadcn/ui components and smooth animations.
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold">Streaming Responses</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time AI responses with token-by-token streaming using Vercel AI SDK.
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-2xl">🔌</span>
                </div>
                <h3 className="font-semibold">Langflow Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Easy integration with Langflow agents. Works with OpenAI too.
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-2xl">🌙</span>
                </div>
                <h3 className="font-semibold">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Full dark mode support with automatic system preference detection.
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="font-semibold">Customizable</h3>
                <p className="text-sm text-muted-foreground">
                  Customize colors, messages, quick actions, and more with simple props.
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-lg border bg-card">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold">Fully Responsive</h3>
                <p className="text-sm text-muted-foreground">
                  Works perfectly on desktop, tablet, and mobile devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="container py-24 border-t">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Try It Out
            </h2>
            <p className="text-muted-foreground mb-8">
              Click the chat button in the bottom-right corner to start a conversation!
            </p>

            <div className="rounded-lg border bg-muted/50 p-8 min-h-[300px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl">👋</div>
                <p className="text-lg font-medium">Look for the chat button below!</p>
                <p className="text-sm text-muted-foreground">
                  It slides in from the right as a non-modal panel, so you can still interact with this page.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Vercel AI SDK, and shadcn/ui
          </p>
        </div>
      </footer>

      <AIChatWidget
        flowId={process.env.NEXT_PUBLIC_LANGFLOW_FLOW_ID}
        title="AI Assistant"
        subtitle="Powered by Langflow"
        welcomeMessage="Hi! I'm your AI assistant. How can I help you today?"
        quickActions={[
          "What can you do?",
          "Tell me about this widget",
          "How do I integrate Langflow?",
        ]}
      />
    </div>
  )
}
