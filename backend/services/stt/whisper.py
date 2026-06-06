import httpx
from .base import STTProvider

_BASE = "https://api.openai.com/v1/audio/transcriptions"


class WhisperProvider(STTProvider):

    def __init__(self, api_key: str):
        self._api_key = api_key

    async def transcribe(self, audio_bytes: bytes, content_type: str) -> str:
        ext = content_type.split("/")[-1].split(";")[0] or "webm"
        filename = f"audio.{ext}"

        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                _BASE,
                headers={"Authorization": f"Bearer {self._api_key}"},
                files={"file": (filename, audio_bytes, content_type)},
                data={"model": "whisper-1"},
            )
            r.raise_for_status()
            return r.json()["text"]
