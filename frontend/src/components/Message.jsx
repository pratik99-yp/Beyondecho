import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Zap, AlertCircle } from 'lucide-react'

function CodeBlock({ inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '')
  if (!inline && match) {
    return (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: '0.75rem 0',
          borderRadius: '10px',
          border: '1px solid #2a2b2d',
          fontSize: '0.875rem',
          background: '#1a1b1d',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    )
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

const markdownComponents = {
  code: CodeBlock,
}

export default function Message({ message }) {
  const { role, content, streaming } = message

  if (role === 'user') {
    return (
      <div className="flex justify-end px-4 py-2 animate-slide-up">
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed"
          style={{ background: '#2a2b2d', color: '#e3e3e3' }}
        >
          {content}
        </div>
      </div>
    )
  }

  if (role === 'error') {
    return (
      <div className="flex items-start gap-3 px-4 py-3 animate-slide-up">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: '#3a1818' }}
        >
          <AlertCircle size={16} className="text-red-400" />
        </div>
        <div
          className="flex-1 px-4 py-3 rounded-2xl text-sm"
          style={{ background: '#2a1a1a', border: '1px solid #4a2a2a', color: '#f28b82' }}
        >
          {content}
        </div>
      </div>
    )
  }

  // assistant
  return (
    <div className="flex items-start gap-3 px-4 py-3 animate-slide-up">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'linear-gradient(135deg, #8ab4f8, #c58af9)' }}
      >
        <Zap size={14} className="text-white" fill="white" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        {content ? (
          <div className="prose-echo">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        ) : null}

        {streaming && (
          <span
            className="inline-block w-0.5 h-4 ml-0.5 animate-cursor-blink align-middle"
            style={{ background: '#8ab4f8' }}
          />
        )}
      </div>
    </div>
  )
}
