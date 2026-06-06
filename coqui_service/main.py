"""
Standalone Coqui TTS service using XTTS v2.
Exposes:
  POST /clone      — save speaker sample, return voice_id (file path)
  POST /synthesize — text + voice_id → audio/wav
  DELETE /voice/{voice_id} — remove saved sample
"""

import os
import uuid
import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from TTS.api import TTS

SAMPLES_DIR = os.getenv("SAMPLES_DIR", "/tmp/voice_samples")
os.makedirs(SAMPLES_DIR, exist_ok=True)

app = FastAPI(title="Coqui TTS Service")

# Load model once at startup — XTTS v2 supports voice cloning from samples
_tts: TTS | None = None


def get_tts() -> TTS:
    global _tts
    if _tts is None:
        _tts = TTS(
            model_name="tts_models/multilingual/multi-dataset/xtts_v2",
            gpu=False,
        )
    return _tts


@app.on_event("startup")
async def startup():
    get_tts()  # warm up


@app.post("/clone")
async def clone(file: UploadFile = File(...), name: str = Form(default="voice")):
    voice_id = f"{uuid.uuid4().hex}"
    path = os.path.join(SAMPLES_DIR, f"{voice_id}.wav")
    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)
    return {"voice_id": voice_id, "sample_path": path}


@app.post("/synthesize")
async def synthesize(text: str = Form(...), voice_id: str = Form(...)):
    sample_path = os.path.join(SAMPLES_DIR, f"{voice_id}.wav")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="voice_id not found")

    tts = get_tts()
    buf = io.BytesIO()
    tts.tts_to_file(
        text=text,
        speaker_wav=sample_path,
        language="en",
        file_path=buf,
    )
    buf.seek(0)
    return Response(content=buf.read(), media_type="audio/wav")


@app.delete("/voice/{voice_id}")
async def delete_voice(voice_id: str):
    path = os.path.join(SAMPLES_DIR, f"{voice_id}.wav")
    if os.path.exists(path):
        os.remove(path)
    return {"status": "deleted"}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "coqui-tts"}
