import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
LLM_MODEL: str = os.getenv("LLM_MODEL", "claude-sonnet-4-6")
VOICE_PROVIDER: str = os.getenv("VOICE_PROVIDER", "elevenlabs")
ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
