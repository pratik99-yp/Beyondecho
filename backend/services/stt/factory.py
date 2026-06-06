from config import STT_PROVIDER, OPENAI_API_KEY
from .base import STTProvider
from .whisper import WhisperProvider


def get_stt_provider() -> STTProvider:
    if STT_PROVIDER == "whisper":
        if not OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is not set — required for Whisper STT")
        return WhisperProvider(api_key=OPENAI_API_KEY)
    raise ValueError(f"Unknown STT_PROVIDER: {STT_PROVIDER!r}")
