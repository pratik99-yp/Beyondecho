from config import VOICE_PROVIDER, ELEVENLABS_API_KEY, COQUI_API_URL
from .base import VoiceProvider
from .elevenlabs import ElevenLabsProvider
from .coqui import CoquiProvider


def get_voice_provider() -> VoiceProvider:
    if VOICE_PROVIDER == "elevenlabs":
        if not ELEVENLABS_API_KEY:
            raise RuntimeError("ELEVENLABS_API_KEY is not set")
        return ElevenLabsProvider(api_key=ELEVENLABS_API_KEY)

    if VOICE_PROVIDER == "coqui":
        return CoquiProvider(base_url=COQUI_API_URL)

    raise ValueError(f"Unknown VOICE_PROVIDER: {VOICE_PROVIDER!r}")
