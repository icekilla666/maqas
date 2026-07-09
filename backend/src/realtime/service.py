from uuid import UUID
from fastapi import WebSocket, status, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from src.realtime.manager import RealtimeConnectionManager
from src.users.repository import UsersRepository
from src.auth.jwt import decode_token

class RealtimeService:
    def __init__(self, manager: RealtimeConnectionManager, users_repo: UsersRepository):
        self.manager = manager
        self.users_repo = users_repo

    async def notify_user(self, user_id: UUID, event_type: str, data: dict):
        await self.manager.send_to_user(
            user_id,
            {
                "type": event_type,
                "data": data,
            }
        )

    async def handle_chat_connection(self, token: str, websocket: WebSocket, session: AsyncSession):
        user_id: UUID | None = None
        try:
            payload = decode_token(token)
            raw_user_id = payload.get("sub")
            user_id = UUID(raw_user_id)
            await self.manager.connect(user_id, websocket)
            while True:
                await websocket.receive_text()
        except Exception:
            return