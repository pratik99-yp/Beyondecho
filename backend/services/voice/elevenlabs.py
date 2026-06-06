import httpx
from .base import VoiceProvider

_BASE = "https://api.elevenlabs.io/v1"


class ElevenLabsProvider(VoiceProvider):

    def __init__(self, api_key: str):
        self._headers = {"xi-api-key": api_key}

    async def clone_voice(self, audio_bytes: bytes, name: str) -> str:
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"{_BASE}/voices/add",
                headers=self._headers,
                files={"files": ("sample.webm", audio_bytes, "audio/webm")},
                data={"name": name, "description": "BeyondEcho cloned voice"},
            )
            r.raise_for_status()
            return r.json()["voice_id"]

    async def synthesize(self, text: str, voice_id: str) -> bytes:
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"{_BASE}/text-to-speech/{voice_id}",
                headers={**self._headers, "Content-Type": "application/json"},
                json={
                    "text": text,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
                },
            )
            r.raise_for_status()
            return r.content

    async def delete_voice(self, voice_id: str) -> None:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.delete(
                f"{_BASE}/voices/{voice_id}",
                headers=self._headers,
            )
            r.raise_for_status()
