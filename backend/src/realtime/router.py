from fastapi import APIRouter, WebSocket, Query

from src.database import SessionDep
from src.realtime.dependencies import RealtimeServiceDep

realtime_router = APIRouter(prefix="/ws", tags=["realtime"])

@realtime_router.websocket("/chats")
async def chats_websocket(
    websocket: WebSocket,
    realtime_service: RealtimeServiceDep,
    session: SessionDep,
    token: str = Query(...)
):
    await realtime_service.handle_chat_connection(token, websocket, session)