from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.llm import stream_chat
import json

router = APIRouter()


@router.websocket("/ws/chat")
async def chat_endpoint(websocket: WebSocket):
    await websocket.accept()
    history: list[dict] = []

    try:
        while True:
            raw = await websocket.receive_text()
            payload = json.loads(raw)
            user_text = payload.get("message", "").strip()

            if not user_text:
                continue

            history.append({"role": "user", "content": user_text})
            full_response = ""

            await websocket.send_json({"type": "start"})

            async for chunk in stream_chat(history):
                full_response += chunk
                await websocket.send_json({"type": "chunk", "content": chunk})

            history.append({"role": "assistant", "content": full_response})
            await websocket.send_json({"type": "done"})

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "content": str(e)})
        except Exception:
            pass
