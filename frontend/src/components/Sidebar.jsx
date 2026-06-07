import { Plus, MessageSquare, Menu, Zap, Mic, Volume2, VolumeX } from 'lucide-react'

export default function Sidebar({ isOpen, onToggle, onNewChat, hasMessages, voiceId, voiceEnabled, onVoiceSetup, onToggleVoice }) {
  return (
    <aside
      className="flex flex-col shrink-0 overflow-hidden transition-all duration-300"
      style={{
        width: isOpen ? '260px' : '0px',
        background: '#1e1f20',
        borderRight: isOpen ? '1px solid #2a2b2d' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #8ab4f8, #c58af9)' }}
          >
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="font-semibold text-white text-[15px] tracking-tight">BeyondEcho</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg transition-colors text-[#9aa0a6] hover:text-white hover:bg-[#2a2b2d]"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="px-3 py-1">
        <button
          onClick={onNewChat}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-colors text-[#e3e3e3] hover:bg-[#2a2b2d] group"
        >
          <Plus size={17} className="text-[#9aa0a6] group-hover:text-[#e3e3e3] transition-colors" />
          <span className="text-sm font-medium">New chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {hasMessages && (
          <div>
            <p className="text-[11px] font-medium text-[#5a5b5d] px-3 py-1.5 uppercase tracking-wider">
              Today
            </p>
            <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-colors text-[#9aa0a6] hover:bg-[#2a2b2d] hover:text-[#e3e3e3] text-left">
              <MessageSquare size={14} className="shrink-0" />
              <span className="text-sm truncate">Current conversation</span>
            </button>
          </div>
        )}
      </div>

      <div className="px-3 py-3 border-t border-[#2a2b2d] space-y-1">
        {/* Voice setup button */}
        <button
          onClick={onVoiceSetup}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl transition-colors text-[#9aa0a6] hover:bg-[#2a2b2d] hover:text-[#e3e3e3] group"
        >
          <Mic size={15} className="shrink-0" />
          <span className="text-sm flex-1 text-left">
            {voiceId ? 'Voice registered ✓' : 'Set up voice'}
          </span>
          {voiceId && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleVoice() }}
              className="p-1 rounded-md hover:bg-[#3a3b3d] transition-colors"
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled
                ? <Volume2 size={13} className="text-[#81c995]" />
                : <VolumeX size={13} className="text-[#9aa0a6]" />}
            </button>
          )}
        </button>
        <p className="text-[11px] text-[#5a5b5d] px-3">BeyondEcho · Phase 2</p>
      </div>
    </aside>
  )
}
