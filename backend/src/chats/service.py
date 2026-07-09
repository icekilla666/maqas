from fastapi import status, HTTPException, UploadFile
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from src.chats.repository import ChatsRepository
from src.users.repository import UsersRepository
from src.users.models import UsersModel
from src.chats.models import ChatsModel, MessagesModel
from src.chats.schemas import ChatOutFull, MessageCreate, MessageOut, ChatOutShort, MessageUpdate
from src.common.images import delete_image, upload_image
from src.realtime.service import RealtimeService
from src.realtime.events import RealtimeEventType

class ChatsService:
    def __init__(self, chats_repo: ChatsRepository, users_repo: UsersRepository, realtime_service: RealtimeService):
        self.chats_repo = chats_repo
        self.users_repo = users_repo
        self.realtime_service = realtime_service

    async def get_or_create_chat(self, user_id: UUID, current_user: UsersModel, session: AsyncSession):
        target_user = await self.users_repo.get_by_id(user_id, session)
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Аккаунт не найден",
                    "error": "USER_NOT_FOUND"
                }
            )
        is_blocked = await self.users_repo.get_block(user_id, current_user.id, session)
        is_blocking = await self.users_repo.get_block(current_user.id, user_id, session)
        user1_id, user2_id = sorted([current_user.id, target_user.id])
        existing_chat = await self.chats_repo.get_chat_by_users_id(user1_id, user2_id, session)
        if existing_chat:
            existing_chat_full = ChatOutShort.model_validate(existing_chat)
            if is_blocked:
                existing_chat_full.is_blocked = True
            if is_blocking:
                existing_chat_full.is_blocking = True
            return {
                "success": True,
                "data": existing_chat_full
            }
        if is_blocked or is_blocking:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Чат с этим пользователем недоступен",
                    "error": "BLOCKED_OR_BLOCKING"
                }
            )
        if user1_id == user2_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя создать чат с собой",
                    "error": "CHAT_WITH_SELF"
                }
            )
        chat_model = ChatsModel(
            user1_id=user1_id,
            user2_id=user2_id
        )
        created_chat = await self.chats_repo.create_chat(chat_model, session)
        return {
            "success": True,
            "data": created_chat
        }
    
    async def get_my_chats(self, current_user: UsersModel, skip: int, limit: int, session: AsyncSession):
        chats_rows, count = await self.chats_repo.get_user_chats(current_user.id, skip, limit, session)
        chats = []
        for chat, unread_messages_count in chats_rows:
            if chat.user1_id == current_user.id:
                target_user = chat.user2
            else:
                target_user = chat.user1
            chats.append(
                ChatOutFull(
                    id=chat.id,
                    unread_messages_count=unread_messages_count,
                    target_user=target_user
                )
            )
        return {
            "success": True,
            "data": chats,
            "total": count,
            "skip": skip,
            "limit": limit
        }
    
    async def delete_chat(self, chat_id: UUID, current_user: UsersModel, session: AsyncSession):
        chat = await self.chats_repo.get_chat_by_id(chat_id, session)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Чат не найден",
                    "error": "CHAT_NOT_FOUND"
                }
            )
        if chat.user1_id != current_user.id and chat.user2_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя удалить чужой чат",
                    "error": "ANOTHER_USER'S_CHAT"
                }
            )
        image_file_ids = await self.chats_repo.get_messages_file_ids(chat.id, session)
        for image_file_id in image_file_ids:
            await delete_image(image_file_id)
        await self.chats_repo.delete_chat(chat, session)
        return {
            "success": True,
            "message": "Чат удален"
        }
    
    async def create_message(self, chat_id: UUID, message: MessageCreate, image: None | UploadFile, current_user: UsersModel, session: AsyncSession):
        chat = await self.chats_repo.get_chat_by_id(chat_id, session)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Чат не найден",
                    "error": "CHAT_NOT_FOUND"
                }
            )
        if chat.user1_id != current_user.id and chat.user2_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя написать в чужой чат",
                    "error": "ANOTHER_USER'S_CHAT"
                }
            )
        if chat.user1_id == current_user.id:
            target_user_id = chat.user2_id
        else:
            target_user_id = chat.user1_id
        is_blocked = await self.users_repo.get_block(target_user_id, current_user.id, session)
        is_blocking = await self.users_repo.get_block(current_user.id, target_user_id, session)
        if is_blocked or is_blocking:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Чат с этим пользователем недоступен",
                    "error": "BLOCKED_OR_BLOCKING"
                }
            )
        if message.parent_id:
            parent = await self.chats_repo.get_message_by_id(message.parent_id, session)
            if not parent:
                raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Сообщение не найдено",
                    "error": "PARENT_MESSAGE_NOT_FOUND"
                }
            )
        if not message.content and not image:
            raise HTTPException(
                status_code=status.HTTP_204_NO_CONTENT,
                detail={
                    "success": False,
                    "message": "Нельзя отправить пустое сообщение",
                    "error": "EMPTY_MESSAGE"
                }
            )
        message_model = MessagesModel(
            content=message.content,
            chat_id=chat.id,
            sender_id=current_user.id,
            parent_id=message.parent_id
        )
        created_message = await self.chats_repo.create_message(message_model, session)
        if image and image.filename:
            try: 
                uploaded_image = await upload_image(image, "message", created_message.id)
                created_message.image_url = uploaded_image["url"]
                created_message.image_file_id = uploaded_image["file_id"]
            except Exception:
                await session.rollback()
                raise
        await session.commit()
        owner_message = MessageOut(
            id=created_message.id,
            chat_id=created_message.chat_id,
            content=created_message.content,
            image_url=created_message.image_url,
            is_read=False,
            created_at=created_message.created_at,
            parent_id=created_message.parent_id,
            sender=current_user,
            is_owner=True
        )
        target_message = MessageOut(
            id=created_message.id,
            chat_id=created_message.chat_id,
            content=created_message.content,
            image_url=created_message.image_url,
            is_read=False,
            created_at=created_message.created_at,
            parent_id=created_message.parent_id,
            sender=current_user,
            is_owner=False
        )
        await self.realtime_service.notify_user(
            user_id=target_user_id,
            event_type=RealtimeEventType.CHAT_MESSAGE_CREATED,
            data={
                "chat_id": str(chat.id),
                "message": target_message.model_dump(mode="json")
            }
        )
        return {
            "success": True,
            "data": owner_message
        }
    
    async def update_message(self, message_id: UUID, update_message: MessageUpdate, image_removed: bool, image: None | UploadFile, current_user: UsersModel, session: AsyncSession):
        message = await self.chats_repo.get_message_by_id_with_sender(message_id, session)
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Сообщение не найдено",
                    "error": "MESSAGE_NOT_FOUND"
                }
            )
        if message.sender_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя изменить чужое сообщение",
                    "error": "ANOTHER_USER'S_MESSAGE"
                }
            )
        chat = await self.chats_repo.get_chat_by_id(message.chat_id, session)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Чат не найден",
                    "error": "CHAT_NOT_FOUND"
                }
            )
        if chat.user1_id == current_user.id:
            target_user_id = chat.user2_id
        else:
            target_user_id = chat.user1_id
        if image_removed:
            await delete_image(message.image_file_id)
            if image:
                uploaded_image = await upload_image(image, "message", message.id)
                message.image_file_id = uploaded_image["file_id"]
                message.image_url = uploaded_image["url"]
            else:
                message.image_file_id = None
                message.image_url = None
        if update_message.content:
            message.content = update_message.content
        await session.commit()
        owner_message = MessageOut.model_validate(message)
        owner_message.is_owner = True
        target_message = MessageOut.model_validate(message)
        target_message.is_owner = False
        await self.realtime_service.notify_user(
            user_id=target_user_id,
            event_type=RealtimeEventType.CHAT_MESSAGE_UPDATED,
            data={
                "chat_id": str(chat.id),
                "message": target_message.model_dump(mode="json")
            }
        )
        return {
            "success": True,
            "data": owner_message
        }
    
    async def delete_message(self, message_id: UUID, current_user: UsersModel, session: AsyncSession):
        message = await self.chats_repo.get_message_by_id(message_id, session)
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Сообщение не найдено",
                    "error": "MESSAGE_NOT_FOUND"
                }
            )
        if message.sender_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя удалить чужое сообщение",
                    "error": "ANOTHER_USER'S_MESSAGE"
                }
            )
        chat = await self.chats_repo.get_chat_by_id(message.chat_id, session)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Чат не найден",
                    "error": "CHAT_NOT_FOUND"
                }
            )
        if chat.user1_id == current_user.id:
            target_user_id = chat.user2_id
        else:
            target_user_id = chat.user1_id
        if message.image_file_id:
            await delete_image(message.image_file_id)
        await self.chats_repo.delete_message(message, session)
        await self.realtime_service.notify_user(
            user_id=target_user_id,
            event_type=RealtimeEventType.CHAT_MESSAGE_DELETED,
            data={
                "chat_id": str(chat.id),
                "message_id": str(message_id)
            }
        )
        return {
            "success": True,
            "message": "Сообщение удалено"
        }
    
    async def mark_messages_as_read(self, chat_id: UUID, current_user: UsersModel, session: AsyncSession):
        chat = await self.chats_repo.get_chat_by_id(chat_id, session)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Чат не найден",
                    "error": "CHAT_NOT_FOUND"
                }
            )
        if chat.user1_id != current_user.id and chat.user2_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя написать в чужой чат",
                    "error": "ANOTHER_USER'S_CHAT"
                }
            )
        if chat.user1_id == current_user.id:
            target_user_id = chat.user2_id
        else:
            target_user_id = chat.user1_id
        await self.chats_repo.read_messages(chat_id, current_user.id, session)
        await self.realtime_service.notify_user(
            user_id=target_user_id,
            event_type=RealtimeEventType.CHAT_MESSAGE_READ,
            data={
                "chat_id": str(chat_id)
            }
        )
        return {
            "success": True
        }
    
    async def get_chat_messages(self, chat_id: UUID, current_user: UsersModel, skip: int, limit: int, session: AsyncSession):
        chat = await self.chats_repo.get_chat_by_id(chat_id, session)
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Чат не найден",
                    "error": "CHAT_NOT_FOUND"
                }
            )
        if chat.user1_id != current_user.id and chat.user2_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя читать чужой чат",
                    "error": "ANOTHER_USER'S_CHAT"
                }
            )
        messages_rows, count = await self.chats_repo.get_chat_messages(chat_id, current_user, skip, limit, session)
        messages = []
        for message, is_owner in messages_rows:
            message_full = MessageOut.model_validate(message)
            message_full.is_owner = is_owner
            messages.append(message_full)
        return {
            "success": True,
            "data": messages
        }