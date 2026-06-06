import { useRef, useState, useEffect, useCallback } from 'react'
import { Send, Wifi, WifiOff, Volume2, VolumeX, Mic, MicOff } from 'lucide-react'
import { useSTT } from '../hooks/useSTT'

export default function InputBar({
  onSend,
  isStreaming,
  isConnected,
  voiceEnabled,
  hasVoice,
  onToggleVoice,
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleFinalResult = useCallback((text) => {
    setValue((prev) => {
      const joined = prev.trim() ? `${prev.trim()} ${text}` : text
      return joined
    })
  }, [])

  const handleInterim = useCallback((text) => {
    // Show interim in placeholder via state — just visual, not committed
  }, [])

  const { isListening, interim, browserSupported, startBrowser, stopBrowser } = useSTT({
    onFinalResult: handleFinalResult,
    onInterimResult: handleInterim,
  })

  const adjustHeight = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  // Focus textarea after STT finishes
  useEffect(() => {
    if (!isListening) textareaRef.current?.focus()
  }, [isListening])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming || !isConnected) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const toggleMic = () => {
    if (!browserSupported) return
    isListening ? stopBrowser() : startBrowser()
  }

  const canSend = value.trim().length > 0 && !isStreaming && isConnected
  const placeholder = isListening
    ? interim || 'Listening…'
    : !isConnected
    ? 'Connecting…'
    : isStreaming
    ? 'BeyondEcho is thinking…'
    : 'Ask BeyondEcho anything…'

  return (
    <div className="shrink-0 px-4 pb-5 pt-3">
      <div className="max-w-3xl mx-auto">
        <div
          className="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all input-glow"
          style={{
            background: '#1e1f20',
            border: `1px solid ${isListening ? '#8ab4f8' : '#2a2b2d'}`,
            boxShadow: isListening ? '0 0 0 1px #8ab4f840, 0 2px 20px #8ab4f825' : undefined,
          }}
        >
          {/* Mic button */}
          {browserSupported && (
            <button
              onClick={toggleMic}
              disabled={isStreaming}
              title={isListening ? 'Stop recording' : 'Speak your message'}
              className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: isListening ? '#8ab4f820' : 'transparent',
                cursor: isStreaming ? 'not-allowed' : 'pointer',
              }}
            >
              {isListening ? (
                <MicOff size={16} className="text-[#8ab4f8] animate-pulse" />
              ) : (
                <Mic size={16} className="text-[#5a5b5d] hover:text-[#9aa0a6]" />
              )}
            </button>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!isConnected || isListening}
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-[15px] text-[#e3e3e3] placeholder-[#5a5b5d] leading-relaxed"
            style={{ maxHeight: '160px', minHeight: '24px' }}
          />

          <div className="flex items-center gap-2 shrink-0">
            {/* Voice TTS toggle */}
            {hasVoice && (
              <button
                onClick={onToggleVoice}
                title={voiceEnabled ? 'Voice on — click to mute' : 'Voice off — click to enable'}
                className="transition-colors"
              >
                {voiceEnabled ? (
                  <Volume2 size={15} className="text-[#81c995]" />
                ) : (
                  <VolumeX size={15} className="text-[#5a5b5d]" />
                )}
              </button>
            )}

            {/* Connection indicator */}
            <div title={isConnected ? 'Connected' : 'Reconnecting…'}>
              {isConnected ? (
                <Wifi size={14} className="text-[#81c995]" />
              ) : (
                <WifiOff size={14} className="text-[#9aa0a6] animate-pulse" />
              )}
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: canSend
                  ? 'linear-gradient(135deg, #8ab4f8, #c58af9)'
                  : '#2a2b2d',
                cursor: canSend ? 'pointer' : 'not-allowed',
              }}
            >
              <Send
                size={15}
                className={canSend ? 'text-white' : 'text-[#5a5b5d]'}
                style={{ transform: 'translateX(1px)' }}
              />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#5a5b5d] mt-2">
          {browserSupported
            ? <>
                <kbd className="font-mono">Enter</kbd> send ·{' '}
                <kbd className="font-mono">Shift+Enter</kbd> newline ·{' '}
                <kbd className="font-mono">Mic</kbd> speak
              </>
            : <>
                <kbd className="font-mono">Enter</kbd> send ·{' '}
                <kbd className="font-mono">Shift+Enter</kbd> newline
              </>}
        </p>
      </div>
    </div>
  )
}
