import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import { useChat } from './hooks/useChat'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { messages, isStreaming, isConnected, sendMessage, clearChat } = useChat()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#131314' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((p) => !p)}
        onNewChat={clearChat}
        hasMessages={messages.length > 0}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <ChatWindow
          messages={messages}
          isStreaming={isStreaming}
          onSuggestion={sendMessage}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
        />
        <InputBar
          onSend={sendMessage}
          isStreaming={isStreaming}
          isConnected={isConnected}
        />
      </div>
    </div>
  )
}
