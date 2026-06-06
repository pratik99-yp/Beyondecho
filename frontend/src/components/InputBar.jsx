import { useRef, useState, useEffect, useCallback } from 'react'
import { Send, Wifi, WifiOff, Volume2, VolumeX, Mic, MicOff } from 'lucide-react'
import { useSTT } from '../hooks/useSTT'

export default function InputBar({
  onSend, isStreaming, isConnected,
  voiceEnabled, hasVoice, onToggleVoice,
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)
  const MAX_CHARS = 4000

  const handleFinalResult = useCallback((text) => {
    setValue((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text))
  }, [])

  const { isListening, interim, browserSupported, startBrowser, stopBrowser } = useSTT({
    onFinalResult: handleFinalResult,
  })

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [value])

  useEffect(() => {
    if (!isListening) textareaRef.current?.focus()
  }, [isListening])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming || !isConnected || trimmed.length > MAX_CHARS) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const toggleMic = () => {
    if (!browserSupported || isStreaming) return
    isListening ? stopBrowser() : startBrowser()
  }

  const canSend  = value.trim().length > 0 && !isStreaming && isConnected && value.length <= MAX_CHARS
  const overLimit = value.length > MAX_CHARS
  const nearLimit = value.length > MAX_CHARS * 0.85

  const placeholder = isListening
    ? interim || 'Listening…'
    : !isConnected ? 'Connecting…'
    : isStreaming   ? 'BeyondEcho is responding…'
    : 'Message BeyondEcho…'

  return (
    <div className="shrink-0 px-4 pb-5 pt-2">
      <div className="max-w-3xl mx-auto">
        <div
          className="glass-input rounded-2xl"
          style={{ borderColor: isListening ? 'rgba(124,158,248,0.5)' : overLimit ? 'rgba(242,139,130,0.4)' : undefined }}
        >
          <div className="flex items-end gap-2 px-4 py-3">
            {/* Mic STT */}
            {browserSupported && (
              <button
                onClick={toggleMic}
                disabled={isStreaming}
                title={isListening ? 'Stop listening' : 'Speak message'}
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: isListening ? 'rgba(124,158,248,0.15)' : 'transparent',
                  cursor: isStreaming ? 'not-allowed' : 'pointer',
                }}
              >
                {isListening
                  ? <MicOff size={16} className="text-accent-blue animate-pulse" />
                  : <Mic size={16} className="text-text-muted hover:text-text-secondary transition-colors" />}
              </button>
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={!isConnected || isListening}
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-[15px] text-text-primary placeholder-text-muted leading-relaxed font-sans"
              style={{ maxHeight: '160px', minHeight: '24px' }}
            />

            {/* Right controls */}
            <div className="flex items-center gap-2 shrink-0">
              {hasVoice && (
                <button onClick={onToggleVoice}
                  title={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
                  className="transition-colors">
                  {voiceEnabled
                    ? <Volume2 size={15} className="text-accent-green" />
                    : <VolumeX size={15} className="text-text-muted" />}
                </button>
              )}

              <div title={isConnected ? 'Connected' : 'Reconnecting…'}>
                {isConnected
                  ? <Wifi size={13} className="text-accent-green" />
                  : <WifiOff size={13} className="text-text-muted animate-pulse" />}
              </div>

              <button
                onClick={submit}
                disabled={!canSend}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: canSend
                    ? 'linear-gradient(135deg, #7c9ef8, #b87af8)'
                    : '#1e1f21',
                  cursor: canSend ? 'pointer' : 'not-allowed',
                  boxShadow: canSend ? '0 2px 12px rgba(124,158,248,0.3)' : 'none',
                  transform: canSend ? undefined : undefined,
                }}
              >
                <Send size={14} className={canSend ? 'text-white' : 'text-text-muted'}
                  style={{ transform: 'translateX(1px)' }} />
              </button>
            </div>
          </div>

          {/* Char count — only near/over limit */}
          {nearLimit && (
            <div className="flex justify-end px-4 pb-2">
              <span className={`text-[11px] font-mono ${overLimit ? 'text-accent-red' : 'text-text-muted'}`}>
                {value.length}/{MAX_CHARS}
              </span>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-text-muted mt-2">
          <kbd className="font-mono bg-bg-elevated px-1 py-0.5 rounded text-[10px]">Enter</kbd> send ·{' '}
          <kbd className="font-mono bg-bg-elevated px-1 py-0.5 rounded text-[10px]">Shift+Enter</kbd> newline
          {browserSupported && <> · <kbd className="font-mono bg-bg-elevated px-1 py-0.5 rounded text-[10px]">Mic</kbd> speak</>}
        </p>
      </div>
    </div>
  )
}
