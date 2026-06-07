import { Plus, MessageSquare, Menu, Zap, Mic, Volume2, VolumeX, X, Sparkles } from 'lucide-react'

export default function Sidebar({
  isOpen, isMobile, onToggle, onNewChat,
  hasMessages, voiceId, voiceEnabled,
  onVoiceSetup, onToggleVoice,
}) {
  const sidebarClass = isMobile
    ? `fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
    : `relative transition-all duration-300 ${isOpen ? 'w-[260px]' : 'w-0'}`

  return (
    <aside
      className={`${sidebarClass} flex flex-col shrink-0 overflow-hidden`}
      style={{
        width: isMobile ? '260px' : undefined,
        background: '#161718',
        borderRight: isOpen ? '1px solid #1f2022' : 'none',
      }}
    >
      {/* ── Brand ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c9ef8 0%, #b87af8 100%)' }}
          >
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <div>
            <p className="font-semibold text-white text-[14px] leading-tight tracking-tight">BeyondEcho</p>
            <p className="text-[10px] text-text-muted leading-tight">AI · Voice · Yours</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          {isMobile ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {/* ── New Chat ── */}
      <div className="px-3 pb-2">
        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'linear-gradient(135deg, rgba(124,158,248,0.12), rgba(184,122,248,0.12))', border: '1px solid rgba(124,158,248,0.2)', color: '#c4cffc' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,158,248,0.2), rgba(184,122,248,0.2))'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,158,248,0.12), rgba(184,122,248,0.12))'}
        >
          <Plus size={16} />
          New chat
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-border-subtle mb-3" />

      {/* ── History ── */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {hasMessages ? (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted px-3 pb-1.5">Today</p>
            <button className="nav-item">
              <MessageSquare size={14} className="shrink-0 text-text-muted" />
              <span className="truncate">Current conversation</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Sparkles size={20} className="text-text-muted mb-2" />
            <p className="text-xs text-text-muted">Your conversations will appear here</p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-3 py-3 space-y-1 border-t border-border-subtle">
        <button
          onClick={onVoiceSetup}
          className="nav-item group"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all"
            style={{ background: voiceId ? 'rgba(111,199,122,0.15)' : 'rgba(124,158,248,0.1)' }}
          >
            <Mic size={12} className={voiceId ? 'text-accent-green' : 'text-accent-blue'} />
          </div>
          <span className="flex-1 text-xs">
            {voiceId ? (
              <span className="text-accent-green font-medium">Voice active</span>
            ) : (
              'Set up voice clone'
            )}
          </span>
          {voiceId && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleVoice() }}
              className="p-1 rounded-md hover:bg-bg-active transition-colors"
              title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {voiceEnabled
                ? <Volume2 size={12} className="text-accent-green" />
                : <VolumeX size={12} className="text-text-muted" />}
            </button>
          )}
        </button>

        <div className="flex items-center gap-2 px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          <p className="text-[10px] text-text-muted">BeyondEcho · v0.5</p>
        </div>
      </div>
    </aside>
  )
}
