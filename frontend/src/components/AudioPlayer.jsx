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
    const onEnded      = ()  => setPlaying(false)
    const onTimeUpdate = ()  => setProgress(audio.currentTime)
    const onLoaded     = ()  => { setDuration(audio.duration); if (autoPlay) audio.play().catch(() => {}) }
    const onPlay       = ()  => setPlaying(true)
    const onPause      = ()  => setPlaying(false)
    audio.addEventListener('ended',           onEnded)
    audio.addEventListener('timeupdate',      onTimeUpdate)
    audio.addEventListener('loadedmetadata',  onLoaded)
    audio.addEventListener('play',            onPlay)
    audio.addEventListener('pause',           onPause)
    return () => {
      audio.removeEventListener('ended',          onEnded)
      audio.removeEventListener('timeupdate',     onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('play',           onPlay)
      audio.removeEventListener('pause',          onPause)
    }
  }, [src, autoPlay])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    playing ? a.pause() : a.play()
  }

  const seek = (e) => {
    const a = audioRef.current
    if (!a || !duration) return
    const r = e.currentTarget.getBoundingClientRect()
    a.currentTime = ((e.clientX - r.left) / r.width) * duration
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const pct  = duration ? (progress / duration) * 100 : 0

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-2xl mt-2.5 w-fit max-w-xs"
      style={{ background: '#1e1f21', border: '1px solid #2a2b2e' }}>
      <audio ref={audioRef} src={src} preload="auto" />

      <button onClick={toggle}
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95"
        style={{ background: 'linear-gradient(135deg, #7c9ef8, #b87af8)' }}>
        {playing
          ? <Pause size={11} className="text-white" fill="white" />
          : <Play  size={11} className="text-white" fill="white" style={{ marginLeft: '1px' }} />}
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-[110px]">
        <Volume2 size={11} className="text-text-muted shrink-0" />
        <div className="flex-1 h-1 rounded-full cursor-pointer" style={{ background: '#2a2b2e' }} onClick={seek}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c9ef8, #b87af8)' }} />
        </div>
        <span className="text-[10px] text-text-muted font-mono shrink-0">{fmt(progress)}</span>
      </div>
    </div>
  )
}
