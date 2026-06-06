import { Zap } from 'lucide-react'

const suggestions = [
  {
    icon: '⚡',
    title: 'Quick summary',
    prompt: 'Summarize the key differences between REST and GraphQL APIs',
  },
  {
    icon: '🐍',
    title: 'Write code',
    prompt: 'Write a Python async function that fetches data from multiple URLs concurrently',
  },
  {
    icon: '🎨',
    title: 'Creative help',
    prompt: 'Give me 5 creative project name ideas for an AI voice assistant startup',
  },
  {
    icon: '🧠',
    title: 'Explain concepts',
    prompt: 'Explain how transformer attention mechanisms work in simple terms',
  },
]

export default function WelcomeScreen({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-10 animate-fade-in select-none">
      {/* Logo */}
      <div className="relative mb-7">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-glow-blue"
          style={{ background: 'linear-gradient(135deg, #7c9ef8 0%, #b87af8 100%)' }}
        >
          <Zap size={36} className="text-white" fill="white" />
        </div>
        <div
          className="absolute inset-0 rounded-3xl opacity-40 blur-xl"
          style={{ background: 'linear-gradient(135deg, #7c9ef8, #b87af8)', zIndex: -1 }}
        />
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-2 tracking-tight">
        <span className="gradient-text">Hello, there</span>
      </h1>
      <p className="text-text-secondary text-[15px] mb-10 text-center max-w-sm">
        Ask me anything — or clone your voice so I can speak back in your own words.
      </p>

      {/* Suggestions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((s) => (
          <button
            key={s.title}
            onClick={() => onSuggestion(s.prompt)}
            className="suggestion-card group animate-slide-up"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-xl">{s.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-text-muted group-hover:text-text-secondary transition-colors">
                {s.title}
              </span>
            </div>
            <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors leading-snug">
              {s.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
