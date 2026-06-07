from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from services.voice.factory import get_voice_provider

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/register")
async def register_voice(
    file: UploadFile = File(...),
    name: str = Form(default="my-voice"),
):
    try:
        provider = get_voice_provider()
        audio_bytes = await file.read()
        voice_id = await provider.clone_voice(audio_bytes, name)
        return {"voice_id": voice_id}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice cloning failed: {e}")


@router.post("/speak")
async def speak(
    text: str = Form(...),
    voice_id: str = Form(...),
):
    try:
        provider = get_voice_provider()
        audio_bytes = await provider.synthesize(text, voice_id)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Synthesis failed: {e}")


@router.delete("/{voice_id}")
async def delete_voice(voice_id: str):
    try:
        provider = get_voice_provider()
        await provider.delete_voice(voice_id)
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
