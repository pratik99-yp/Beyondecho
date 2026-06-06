import { useState, useEffect, useRef, useCallback } from 'react'

const WS_URL = import.meta.env.VITE_WS_URL || '/ws/chat'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)
  const mountedRef = useRef(true)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = WS_URL.startsWith('ws')
      ? WS_URL
      : `${protocol}//${window.location.host}${WS_URL}`

    const ws = new WebSocket(url)

    ws.onopen = () => {
      if (!mountedRef.current) return
      setIsConnected(true)
      clearTimeout(reconnectRef.current)
    }

    ws.onclose = () => {
      if (!mountedRef.current) return
      setIsConnected(false)
      reconnectRef.current = setTimeout(connect, 3000)
    }

    ws.onerror = () => {
      ws.close()
    }

    ws.onmessage = (event) => {
      if (!mountedRef.current) return
      const data = JSON.parse(event.data)

      if (data.type === 'start') {
        setIsStreaming(true)
        setMessages((prev) => [
          ...prev,
          { id: `ai-${Date.now()}`, role: 'assistant', content: '', streaming: true },
        ])
      } else if (data.type === 'chunk') {
        setMessages((prev) => {
          const updated = [...prev]
          const last = { ...updated[updated.length - 1] }
          last.content += data.content
          updated[updated.length - 1] = last
          return updated
        })
      } else if (data.type === 'done') {
        setIsStreaming(false)
        setMessages((prev) => {
          const updated = [...prev]
          const last = { ...updated[updated.length - 1], streaming: false }
          updated[updated.length - 1] = last
          return updated
        })
      } else if (data.type === 'error') {
        setIsStreaming(false)
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'error',
            content: data.content || 'Something went wrong. Please try again.',
            streaming: false,
          },
        ])
      }
    }

    wsRef.current = ws
  }, [])

  useEffect(() => {
    mountedRef.current = true
    connect()
    return () => {
      mountedRef.current = false
      clearTimeout(reconnectRef.current)
      wsRef.current?.close()
    }
  }, [connect])

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming || wsRef.current?.readyState !== WebSocket.OPEN) return

      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: 'user', content: trimmed, streaming: false },
      ])

      wsRef.current.send(JSON.stringify({ message: trimmed }))
    },
    [isStreaming]
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setIsStreaming(false)
    wsRef.current?.close()
  }, [])

  return { messages, isStreaming, isConnected, sendMessage, clearChat }
}
