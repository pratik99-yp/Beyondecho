import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Zap, AlertCircle, Copy, Check } from 'lucide-react'
import AudioPlayer from './AudioPlayer'

function CopyButton({ text, size = 14 }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all"
      style={{ color: copied ? '#6fc77a' : '#9095a0', background: copied ? 'rgba(111,199,122,0.1)' : 'transparent' }}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function CodeBlock({ inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '')
  const code = String(children).replace(/\n$/, '')

  if (!inline && match) {
    return (
      <div className="rounded-xl overflow-hidden my-3" style={{ border: '1px solid #2a2b2e' }}>
        <div className="code-header">
          <span>{match[1]}</span>
          <CopyButton text={code} size={12} />
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: '#13141a',
            padding: '1rem',
            fontSize: '0.845rem',
          }}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    )
  }
  return <code className={className} {...props}>{children}</code>
}

const mdComponents = { code: CodeBlock }

export default function Message({ message, audioUrl }) {
  const { role, content, streaming } = message
  const [hovered, setHovered] = useState(false)

  if (role === 'user') {
    return (
      <div className="flex justify-end px-4 py-2 animate-slide-up">
        <div className="flex flex-col items-end max-w-[80%] sm:max-w-[70%]">
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed"
            style={{ background: '#1e1f21', border: '1px solid #2a2b2e', color: '#f0f0f0' }}
          >
            {content}
          </div>
        </div>
      </div>
    )
  }

  if (role === 'error') {
    return (
      <div className="flex items-start gap-3 px-4 py-3 animate-slide-up">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'rgba(242,139,130,0.1)', border: '1px solid rgba(242,139,130,0.2)' }}>
          <AlertCircle size={15} className="text-accent-red" />
        </div>
        <div className="flex-1 px-4 py-3 rounded-2xl text-sm"
          style={{ background: 'rgba(242,139,130,0.06)', border: '1px solid rgba(242,139,130,0.15)', color: '#f28b82' }}>
          {content}
        </div>
      </div>
    )
  }

  // assistant
  return (
    <div
      className="group flex items-start gap-3 px-4 py-3 animate-slide-up rounded-2xl transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? 'rgba(255,255,255,0.015)' : 'transparent' }}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'linear-gradient(135deg, #7c9ef8, #b87af8)' }}
      >
        <Zap size={13} className="text-white" fill="white" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Content */}
        {content ? (
          <div className="prose-echo">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {content}
            </ReactMarkdown>
          </div>
        ) : null}

        {streaming && (
          <span
            className="inline-block w-0.5 h-[17px] ml-0.5 rounded-full animate-cursor-blink align-middle"
            style={{ background: 'linear-gradient(180deg, #7c9ef8, #b87af8)' }}
          />
        )}

        {/* Actions row */}
        {!streaming && content && (
          <div className={`flex items-center gap-1 mt-1 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <CopyButton text={content} />
          </div>
        )}

        {/* Audio player */}
        {audioUrl && !streaming && <AudioPlayer src={audioUrl} autoPlay />}
      </div>
    </div>
  )
}
