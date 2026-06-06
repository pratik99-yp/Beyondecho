import { useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'
import Message from './Message'
import WelcomeScreen from './WelcomeScreen'

export default function ChatWindow({
  messages,
  isStreaming,
  onSuggestion,
  sidebarOpen,
  onToggleSidebar,
  audioUrls,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {/* Header — only shown when sidebar is closed */}
      {!sidebarOpen && (
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid #2a2b2d' }}
        >
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg transition-colors text-[#9aa0a6] hover:text-white hover:bg-[#2a2b2d]"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-medium text-[#9aa0a6]">BeyondEcho</span>
        </div>
      )}

      {/* Messages or welcome */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col h-full">
            <WelcomeScreen onSuggestion={onSuggestion} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full py-4">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} audioUrl={audioUrls?.[msg.id]} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#9aa0a6]"
            style={{ background: '#1e1f20', border: '1px solid #2a2b2d' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ab4f8] animate-pulse" />
            Thinking…
          </div>
        </div>
      )}
    </div>
  )
}
