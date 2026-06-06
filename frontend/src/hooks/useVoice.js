import { useState, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

export function useVoice() {
  const [voiceId, setVoiceId] = useState(() => localStorage.getItem('be_voice_id') || null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(
    () => localStorage.getItem('be_voice_enabled') === 'true'
  )
  const [error, setError] = useState(null)

  const registerVoice = useCallback(async (audioBlob) => {
    setIsRegistering(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', audioBlob, 'sample.webm')
      form.append('name', 'beyondecho-voice')

      const res = await fetch(`${API_BASE}/voice/register`, { method: 'POST', body: form })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
      }

      const { voice_id } = await res.json()
      setVoiceId(voice_id)
      localStorage.setItem('be_voice_id', voice_id)
      setVoiceEnabled(true)
      localStorage.setItem('be_voice_enabled', 'true')
      return voice_id
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setIsRegistering(false)
    }
  }, [])

  const speak = useCallback(
    async (text) => {
      if (!voiceId || !voiceEnabled) return null
      setIsSpeaking(true)
      try {
        const form = new FormData()
        form.append('text', text)
        form.append('voice_id', voiceId)

        const res = await fetch(`${API_BASE}/voice/speak`, { method: 'POST', body: form })
        if (!res.ok) return null

        const blob = await res.blob()
        return URL.createObjectURL(blob)
      } catch {
        return null
      } finally {
        setIsSpeaking(false)
      }
    },
    [voiceId, voiceEnabled]
  )

  const clearVoice = useCallback(async () => {
    if (voiceId) {
      await fetch(`${API_BASE}/voice/${voiceId}`, { method: 'DELETE' }).catch(() => {})
    }
    setVoiceId(null)
    setVoiceEnabled(false)
    localStorage.removeItem('be_voice_id')
    localStorage.removeItem('be_voice_enabled')
  }, [voiceId])

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      const next = !prev
      localStorage.setItem('be_voice_enabled', String(next))
      return next
    })
  }, [])

  return {
    voiceId,
    isRegistering,
    isSpeaking,
    voiceEnabled,
    error,
    registerVoice,
    speak,
    clearVoice,
    toggleVoice,
  }
}
