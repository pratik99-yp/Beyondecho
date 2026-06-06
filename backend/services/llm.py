from anthropic import AsyncAnthropic
from typing import AsyncGenerator
from config import ANTHROPIC_API_KEY, LLM_MODEL

client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

SYSTEM_PROMPT = (
    "You are BeyondEcho, a helpful and intelligent AI assistant. "
    "You are conversational, clear, and concise. "
    "Format your responses using markdown when appropriate — "
    "use code blocks, bullet points, and headers to improve readability."
)


async def stream_chat(messages: list[dict]) -> AsyncGenerator[str, None]:
    async with client.messages.stream(
        model=LLM_MODEL,
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield text
