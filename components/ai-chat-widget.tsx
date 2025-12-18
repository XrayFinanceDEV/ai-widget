'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, Sparkles } from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'

interface AIChatWidgetProps {
  flowId?: string
  apiEndpoint?: string
  welcomeMessage?: string
  quickActions?: string[]
  title?: string
  subtitle?: string
}

export function AIChatWidget({
  flowId,
  apiEndpoint = '/api/chat',
  welcomeMessage = 'Hi! Ask me anything.',
  quickActions = [
    "How can you help me?",
    "What can you do?",
    "Tell me more",
  ],
  title = 'AI Assistant',
  subtitle
}: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: apiEndpoint,
      body: {
        flowId,
      },
    }),
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const messageContent = input
    setInput('')
    await sendMessage({ text: messageContent })
  }

  const onQuickAction = (action: string) => {
    setInput(action)
  }

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] flex flex-col p-0 shadow-2xl border-l"
      >
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <SheetTitle>{title}</SheetTitle>
          </div>
          {subtitle && (
            <Badge variant="outline" className="w-fit mt-2">
              {subtitle}
            </Badge>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-4 rounded-r">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {welcomeMessage}
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-3 rounded-r">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">💭</div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t">
          {messages.length === 0 && quickActions.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {quickActions.map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  className="text-xs whitespace-nowrap"
                  onClick={() => onQuickAction(action)}
                >
                  {action}
                </Button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
