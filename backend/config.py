import os
from dotenv import load_dotenv

load_dotenv()

# LLM — Groq
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
LLM_MODEL: str    = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")

# Voice TTS
VOICE_PROVIDER:    str = os.getenv("VOICE_PROVIDER", "coqui")
ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
COQUI_API_URL:     str = os.getenv("COQUI_API_URL", "http://localhost:7000")

# STT
STT_PROVIDER:  str = os.getenv("STT_PROVIDER", "whisper")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

# CORS
CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
