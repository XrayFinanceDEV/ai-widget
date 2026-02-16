import { AIChatWidget } from '@/components/ai-chat-widget'

export default function WidgetPage() {
  return (
    <div className="widget-container">
      <AIChatWidget
        title="AI Assistant"
        subtitle="Powered by Open-Notebook"
        welcomeMessage="Ciao! Come posso aiutarti?"
        quickActions={[
          "Di cosa parla questo documento?",
          "Quali sono le regole principali?",
          "Spiegami meglio",
        ]}
      />
    </div>
  )
}
