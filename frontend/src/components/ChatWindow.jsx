import { useEffect, useRef } from 'react'
import { Menu, Zap } from 'lucide-react'
import Message from './Message'
import WelcomeScreen from './WelcomeScreen'

export default function ChatWindow({
  messages, isStreaming, onSuggestion,
  sidebarOpen, isMobile, onToggleSidebar, audioUrls,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const showHeader = !sidebarOpen || isMobile

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {/* Top bar — shown when sidebar closed or on mobile */}
      {showHeader && (
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid #1f2022', background: 'rgba(15,16,17,0.8)', backdropFilter: 'blur(12px)' }}
        >
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c9ef8, #b87af8)' }}
            >
              <Zap size={11} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold text-text-primary">BeyondEcho</span>
          </div>
        </div>
      )}

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestion={onSuggestion} />
        ) : (
          <div className="max-w-3xl mx-auto w-full py-6 px-2">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} audioUrl={audioUrls?.[msg.id]} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Thinking pill */}
      {isStreaming && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 pointer-events-none">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(22,23,24,0.9)', border: '1px solid #2a2b2e', backdropFilter: 'blur(12px)', color: '#9095a0' }}
          >
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            Generating response
          </div>
        </div>
      )}
    </div>
  )
}
