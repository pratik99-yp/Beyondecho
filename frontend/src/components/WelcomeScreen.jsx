import { Zap } from 'lucide-react'

const suggestions = [
  { label: 'Explain quantum computing', icon: '⚛️' },
  { label: 'Write a Python script to sort a list', icon: '🐍' },
  { label: 'Help me plan my week', icon: '📅' },
  { label: 'What are the latest trends in AI?', icon: '🤖' },
]

export default function WelcomeScreen({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 animate-fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, #8ab4f8 0%, #c58af9 100%)' }}
      >
        <Zap size={30} className="text-white" fill="white" />
      </div>

      <h1 className="text-3xl font-semibold mb-2 text-center">
        <span
          style={{
            background: 'linear-gradient(135deg, #8ab4f8 0%, #c58af9 60%, #81c995 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Hello, there
        </span>
      </h1>
      <p className="text-[#9aa0a6] text-[15px] mb-10">How can I help you today?</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion(s.label)}
            className="flex items-start gap-3 p-4 rounded-2xl text-left transition-all group"
            style={{
              background: '#1e1f20',
              border: '1px solid #2a2b2d',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a2b2d'
              e.currentTarget.style.borderColor = '#3a3b3d'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1e1f20'
              e.currentTarget.style.borderColor = '#2a2b2d'
            }}
          >
            <span className="text-xl mt-0.5">{s.icon}</span>
            <span className="text-sm text-[#c4c7cc] leading-snug group-hover:text-white transition-colors">
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
