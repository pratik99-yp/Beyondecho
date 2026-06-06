from abc import ABC, abstractmethod


class VoiceProvider(ABC):

    @abstractmethod
    async def clone_voice(self, audio_bytes: bytes, name: str) -> str:
        """Upload an audio sample and return a voice_id."""

    @abstractmethod
    async def synthesize(self, text: str, voice_id: str) -> bytes:
        """Convert text to audio bytes using a cloned voice."""

    @abstractmethod
    async def delete_voice(self, voice_id: str) -> None:
        """Remove a cloned voice from the provider."""
