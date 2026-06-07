from groq import AsyncGroq
from typing import AsyncGenerator
from config import GROQ_API_KEY, LLM_MODEL

client = AsyncGroq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = (
    "You are BeyondEcho, a helpful and intelligent AI assistant. "
    "You are conversational, clear, and concise. "
    "Format your responses using markdown when appropriate — "
    "use code blocks, bullet points, and headers to improve readability."
)


async def stream_chat(messages: list[dict]) -> AsyncGenerator[str, None]:
    stream = await client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, *messages],
        stream=True,
        max_tokens=2048,
    )
    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content
