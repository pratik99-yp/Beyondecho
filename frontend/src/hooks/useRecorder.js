import { useState, useRef, useCallback } from 'react'

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
    const recorder = new MediaRecorder(stream, { mimeType })

    chunksRef.current = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      setAudioBlob(blob)
      setAudioUrl(URL.createObjectURL(blob))
      stream.getTracks().forEach((t) => t.stop())
    }

    recorder.start(100)
    recorderRef.current = recorder
    setIsRecording(true)
    setDuration(0)
    setAudioBlob(null)
    setAudioUrl(null)

    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
  }, [])

  const stop = useCallback(() => {
    recorderRef.current?.stop()
    setIsRecording(false)
    clearInterval(timerRef.current)
  }, [])

  const reset = useCallback(() => {
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
  }, [])

  return { isRecording, duration, audioBlob, audioUrl, start, stop, reset }
}
