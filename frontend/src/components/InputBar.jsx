import { useRef, useState, useEffect } from 'react'
import { Send, Wifi, WifiOff } from 'lucide-react'

export default function InputBar({ onSend, isStreaming, isConnected }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const adjustHeight = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const canSend = value.trim().length > 0 && !isStreaming && isConnected

  return (
    <div className="shrink-0 px-4 pb-5 pt-3">
      <div className="max-w-3xl mx-auto">
        <div
          className="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all input-glow"
          style={{
            background: '#1e1f20',
            border: '1px solid #2a2b2d',
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !isConnected
                ? 'Connecting…'
                : isStreaming
                ? 'BeyondEcho is thinking…'
                : 'Ask BeyondEcho anything…'
            }
            disabled={!isConnected}
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-[15px] text-[#e3e3e3] placeholder-[#5a5b5d] leading-relaxed"
            style={{ maxHeight: '160px', minHeight: '24px' }}
          />

          <div className="flex items-center gap-2 shrink-0">
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
          Press <kbd className="font-mono">Enter</kbd> to send ·{' '}
          <kbd className="font-mono">Shift+Enter</kbd> for newline
        </p>
      </div>
    </div>
  )
}
