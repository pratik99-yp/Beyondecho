import { useEffect, useRef } from 'react'
import { Mic, MicOff, X, Upload, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import { useRecorder } from '../hooks/useRecorder'

function fmt(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function VoiceSetup({ onClose, onRegister, isRegistering, voiceId, onClear, error }) {
  const { isRecording, duration, audioBlob, audioUrl, start, stop, reset } = useRecorder()
  const audioRef = useRef(null)

  // auto-stop after 60s
  useEffect(() => {
    if (duration >= 60) stop()
  }, [duration, stop])

  const handleUploadFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    onRegister(file)
  }

  const step = voiceId ? 'done' : audioBlob ? 'review' : isRecording ? 'recording' : 'idle'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{ background: '#1e1f20', border: '1px solid #2a2b2d' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9aa0a6] hover:text-white hover:bg-[#2a2b2d] transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-white mb-1">Voice Setup</h2>
        <p className="text-sm text-[#9aa0a6] mb-6">
          Record 15–30 seconds of your voice so BeyondEcho can speak back in your voice.
        </p>

        {/* DONE state */}
        {step === 'done' && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-[#1a3a2a] flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-[#81c995]" />
            </div>
            <p className="text-white font-medium mb-1">Voice registered!</p>
            <p className="text-sm text-[#9aa0a6] mb-6">
              AI responses will now be spoken in your voice.
            </p>
            <button
              onClick={onClear}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-[#2a2b2d] transition-colors"
            >
              <Trash2 size={15} />
              Remove voice
            </button>
          </div>
        )}

        {/* REVIEW state */}
        {step === 'review' && (
          <div>
            <p className="text-sm text-[#9aa0a6] mb-3">
              Recorded {fmt(duration)} — listen back, then upload.
            </p>
            <audio ref={audioRef} src={audioUrl} controls className="w-full rounded-lg mb-4" />
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#e3e3e3] hover:bg-[#2a2b2d] transition-colors"
                style={{ border: '1px solid #3a3b3d' }}
              >
                Re-record
              </button>
              <button
                onClick={() => onRegister(audioBlob)}
                disabled={isRegistering}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: isRegistering
                    ? '#2a2b2d'
                    : 'linear-gradient(135deg, #8ab4f8, #c58af9)',
                  cursor: isRegistering ? 'not-allowed' : 'pointer',
                }}
              >
                {isRegistering ? 'Uploading…' : 'Use this voice'}
              </button>
            </div>
          </div>
        )}

        {/* RECORDING state */}
        {step === 'recording' && (
          <div className="text-center py-2">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <button
                onClick={stop}
                className="relative w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
              >
                <MicOff size={28} className="text-white" />
              </button>
            </div>
            <p className="text-white font-mono text-2xl mb-1">{fmt(duration)}</p>
            <p className="text-sm text-[#9aa0a6]">Recording… click to stop</p>
            <p className="text-xs text-[#5a5b5d] mt-1">Speak clearly and naturally</p>
          </div>
        )}

        {/* IDLE state */}
        {step === 'idle' && (
          <div className="text-center py-2">
            <button
              onClick={start}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #8ab4f8, #c58af9)' }}
            >
              <Mic size={30} className="text-white" />
            </button>
            <p className="text-white font-medium mb-1">Tap to start recording</p>
            <p className="text-sm text-[#9aa0a6] mb-6">Aim for 15–30 seconds</p>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#2a2b2d]" />
              <span className="text-xs text-[#5a5b5d]">or</span>
              <div className="flex-1 h-px bg-[#2a2b2d]" />
            </div>

            <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-[#9aa0a6] hover:text-white hover:bg-[#2a2b2d] transition-colors cursor-pointer"
              style={{ border: '1px solid #3a3b3d' }}>
              <Upload size={15} />
              Upload audio file
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleUploadFile}
              />
            </label>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 mt-4 p-3 rounded-xl text-sm text-red-400"
            style={{ background: '#2a1a1a', border: '1px solid #4a2a2a' }}>
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
