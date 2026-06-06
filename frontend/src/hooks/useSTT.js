import { useState, useRef, useCallback, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

const isBrowserSTTSupported = () =>
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

export function useSTT({ onFinalResult, onInterimResult } = {}) {
  const [isListening, setIsListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [browserSupported] = useState(isBrowserSTTSupported)
  const recognizerRef = useRef(null)

  // ── Browser WebSpeech (primary, no API key needed) ──────────────────────
  const startBrowser = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.maxAlternatives = 1

    rec.onstart = () => setIsListening(true)

    rec.onresult = (event) => {
      let interimText = ''
      let finalText = ''

      for (const result of event.results) {
        if (result.isFinal) finalText += result[0].transcript
        else interimText += result[0].transcript
      }

      if (interimText) {
        setInterim(interimText)
        onInterimResult?.(interimText)
      }
      if (finalText) {
        setInterim('')
        onFinalResult?.(finalText.trim())
      }
    }

    rec.onerror = (e) => {
      console.error('STT error:', e.error)
      setIsListening(false)
      setInterim('')
    }

    rec.onend = () => {
      setIsListening(false)
      setInterim('')
    }

    rec.start()
    recognizerRef.current = rec
  }, [onFinalResult, onInterimResult])

  const stopBrowser = useCallback(() => {
    recognizerRef.current?.stop()
  }, [])

  // ── Whisper via backend (higher accuracy, needs OPENAI_API_KEY on server) ─
  const transcribeWhisper = useCallback(
    async (audioBlob) => {
      const form = new FormData()
      form.append('file', audioBlob, 'recording.webm')
      const res = await fetch(`${API_BASE}/voice/transcribe`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Transcription failed')
      const { text } = await res.json()
      return text
    },
    []
  )

  useEffect(() => {
    return () => recognizerRef.current?.abort()
  }, [])

  return {
    isListening,
    interim,
    browserSupported,
    startBrowser,
    stopBrowser,
    transcribeWhisper,
  }
}
