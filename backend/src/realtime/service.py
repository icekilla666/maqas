from uuid import UUID
from fastapi import WebSocket, status, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from src.realtime.manager import RealtimeConnectionManager
from src.users.repository import UsersRepository
from src.auth.jwt import decode_token
from src.realtime.events import RealtimeEventType
from src.chats.repository import ChatsRepository

class RealtimeService:
    def __init__(self, manager: RealtimeConnectionManager, users_repo: UsersRepository, chats_repo: ChatsRepository):
        self.manager = manager
        self.users_repo = users_repo
        self.chats_repo = chats_repo

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
            if not payload or payload.get("type") != "access":
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                return

            raw_user_id = payload.get("sub")
            if not raw_user_id:
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                return

            user_id = UUID(raw_user_id)

            user = await self.users_repo.get_by_id(user_id, session)
            if not user:
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                return

            await self.manager.connect(user_id, websocket)

            while True:
                try:
                    message = await websocket.receive_json()
                except Exception:
                    continue

                event_type = message.get("type")
                data = message.get("data", {})

                if event_type == RealtimeEventType.CHAT_TYPING_STARTED:
                    await self.handle_typing_started(user_id, data, session)

                elif event_type == RealtimeEventType.CHAT_TYPING_STOPPED:
                    await self.handle_typing_stopped(user_id, data, session)
        except WebSocketDisconnect:
            pass

        finally:
            if user_id:
                self.manager.disconnect(user_id, websocket)
        
    async def handle_typing_started(self, user_id: UUID, data: dict, session: AsyncSession):
        chat_id = UUID(data["chat_id"])
        chat = await self.chats_repo.get_chat_by_id(chat_id, session)
        if not chat:
            return
        if chat.user1_id != user_id and chat.user2_id != user_id:
            return
        target_user_id = chat.user2_id if chat.user1_id == user_id else chat.user1_id
        await self.notify_user(
            user_id=target_user_id,
            event_type=RealtimeEventType.CHAT_TYPING_STARTED,
            data={
                "chat_id": str(chat_id),
                "user_id": str(user_id)
            }
        )

    async def handle_typing_stopped(self, user_id: UUID, data: dict, session: AsyncSession):
        chat_id = UUID(data["chat_id"])
        chat = await self.chats_repo.get_chat_by_id(chat_id, session)
        if not chat:
            return
        if chat.user1_id != user_id and chat.user2_id != user_id:
            return
        target_user_id = chat.user2_id if chat.user1_id == user_id else chat.user1_id
        await self.notify_user(
            user_id=target_user_id,
            event_type=RealtimeEventType.CHAT_TYPING_STOPPED,
            data={
                "chat_id": str(chat_id),
                "user_id": str(user_id)
            }
        )