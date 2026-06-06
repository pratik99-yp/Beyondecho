import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

export default function AudioPlayer({ src, autoPlay = true }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onEnded = () => setPlaying(false)
    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onLoaded = () => {
      setDuration(audio.duration)
      if (autoPlay) audio.play().catch(() => {})
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [src, autoPlay])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    playing ? audio.pause() : audio.play()
  }

  const seek = (e) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * duration
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const pct = duration ? (progress / duration) * 100 : 0

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-xl mt-2 w-fit max-w-xs"
      style={{ background: '#2a2b2d', border: '1px solid #3a3b3d' }}
    >
      <audio ref={audioRef} src={src} preload="auto" />

      <button
        onClick={toggle}
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #8ab4f8, #c58af9)' }}
      >
        {playing ? (
          <Pause size={12} className="text-white" fill="white" />
        ) : (
          <Play size={12} className="text-white" fill="white" style={{ marginLeft: '1px' }} />
        )}
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-[100px]">
        <Volume2 size={12} className="text-[#9aa0a6] shrink-0" />
        <div
          className="flex-1 h-1 rounded-full cursor-pointer relative"
          style={{ background: '#3a3b3d' }}
          onClick={seek}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #8ab4f8, #c58af9)',
            }}
          />
        </div>
        <span className="text-[10px] text-[#9aa0a6] shrink-0 font-mono">{fmt(progress)}</span>
      </div>
    </div>
  )
}
