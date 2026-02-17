import { EmbeddedChatWidget } from '@/components/embedded-chat-widget'

export const metadata = {
  title: 'AI Chat Widget',
}

export default function WidgetPage() {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <EmbeddedChatWidget
        title="BRIX-IA Assistant"
        subtitle="Powered by Open-Notebook"
        welcomeMessage="Ciao! Sono l'assistente AI di BRIX-IA. Come posso aiutarti?"
        quickActions={[
          'Cosa fa BRIX-IA?',
          'Come posso iscrivermi?',
          'Parlami dei tuoi servizi',
        ]}
      />
    </div>
  )
}
