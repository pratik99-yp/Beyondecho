import httpx
from .base import VoiceProvider

_DEFAULT_URL = "http://localhost:7000"


class CoquiProvider(VoiceProvider):
    """
    Talks to the standalone coqui_service (XTTS v2).
    voice_id here is the UUID returned by /clone — the service
    keeps the sample on disk and references it at synthesis time.
    """

    def __init__(self, base_url: str = _DEFAULT_URL):
        self._base = base_url.rstrip("/")

    async def clone_voice(self, audio_bytes: bytes, name: str) -> str:
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"{self._base}/clone",
                files={"file": ("sample.wav", audio_bytes, "audio/wav")},
                data={"name": name},
            )
            r.raise_for_status()
            return r.json()["voice_id"]

    async def synthesize(self, text: str, voice_id: str) -> bytes:
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(
                f"{self._base}/synthesize",
                data={"text": text, "voice_id": voice_id},
            )
            r.raise_for_status()
            return r.content

    async def delete_voice(self, voice_id: str) -> None:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.delete(f"{self._base}/voice/{voice_id}")
            r.raise_for_status()
