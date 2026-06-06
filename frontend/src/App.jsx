import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import InputBar from './components/InputBar'
import VoiceSetup from './components/VoiceSetup'
import { useChat } from './hooks/useChat'
import { useVoice } from './hooks/useVoice'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [voiceSetupOpen, setVoiceSetupOpen] = useState(false)
  const [audioUrls, setAudioUrls] = useState({})

  const { messages, isStreaming, isConnected, sendMessage, clearChat } = useChat()
  const { voiceId, isRegistering, voiceEnabled, error: voiceError,
          registerVoice, speak, clearVoice, toggleVoice } = useVoice()

  const prevLastRef = useRef(null)

  // Responsive: collapse sidebar on mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-speak when AI message finishes streaming
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'assistant' || last.streaming) return
    if (prevLastRef.current?.id === last.id) return
    prevLastRef.current = last
    if (!voiceId || !voiceEnabled || audioUrls[last.id]) return
    speak(last.content).then((url) => {
      if (url) setAudioUrls((p) => ({ ...p, [last.id]: url }))
    })
  }, [messages, voiceId, voiceEnabled, speak, audioUrls])

  const handleNewChat = () => {
    clearChat()
    setAudioUrls({})
    if (isMobile) setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onToggle={() => setSidebarOpen((p) => !p)}
        onNewChat={handleNewChat}
        hasMessages={messages.length > 0}
        voiceId={voiceId}
        voiceEnabled={voiceEnabled}
        onVoiceSetup={() => setVoiceSetupOpen(true)}
        onToggleVoice={toggleVoice}
      />

      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <ChatWindow
          messages={messages}
          isStreaming={isStreaming}
          onSuggestion={sendMessage}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
          audioUrls={audioUrls}
        />
        <InputBar
          onSend={sendMessage}
          isStreaming={isStreaming}
          isConnected={isConnected}
          voiceEnabled={voiceEnabled}
          hasVoice={!!voiceId}
          onToggleVoice={toggleVoice}
        />
      </div>

      {voiceSetupOpen && (
        <VoiceSetup
          onClose={() => setVoiceSetupOpen(false)}
          onRegister={registerVoice}
          isRegistering={isRegistering}
          voiceId={voiceId}
          onClear={clearVoice}
          error={voiceError}
        />
      )}
    </div>
  )
}
