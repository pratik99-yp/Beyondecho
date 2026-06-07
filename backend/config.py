import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
LLM_MODEL: str = os.getenv("LLM_MODEL", "claude-sonnet-4-6")
VOICE_PROVIDER: str = os.getenv("VOICE_PROVIDER", "elevenlabs")
ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
STT_PROVIDER: str = os.getenv("STT_PROVIDER", "whisper")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
COQUI_API_URL: str = os.getenv("COQUI_API_URL", "http://coqui:7000")
CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
