import asyncio
import logging
from uuid import UUID
from datetime import datetime, timezone
from fastapi import HTTPException, status, UploadFile
from src.configs import settings
import cloudinary

logger = logging.getLogger(__name__)

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"}
MAX_SIZE = 5 * 1024 * 1024  

async def upload_image(file: UploadFile, folder: str, owner_id: UUID):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неподдерживаемый тип файла"
        )
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Файл слишком большой"
        )
    ext = file.filename.split('.')[-1].lower() if file.filename else 'jpg'
    timestamp = int(datetime.now(timezone.utc).timestamp()) 
    public_id = f"{folder}/{owner_id}_{timestamp}.{ext}"
    try:
        loop = asyncio.get_event_loop()
        upload_result = await loop.run_in_executor(
            None,
            lambda: cloudinary.uploader.upload(
                content,
                public_id=public_id,
                folder=folder,
                overwrite=True
            )
        )
    except Exception as e:
        logger.error(f"Ошибка загрузки в Cloudinary: {public_id} - {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка загрузки в Cloudinary: {str(e)}"
        )
    return {
        "url": upload_result["secure_url"],
        "file_id": upload_result["public_id"]
    }

async def delete_image(file_id: str):
    if not file_id:
        return False
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: cloudinary.uploader.destroy(file_id)
        )
        if result.get("result") == "ok":
            return True
        else:
            return False
    except Exception as e:
        logger.error(f"Ошибка удаления изображения {file_id}: {e}", exc_info=True)
        return False