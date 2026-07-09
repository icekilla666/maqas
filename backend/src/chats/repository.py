from sqlalchemy import select, or_, func, update, exists
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.chats.models import ChatsModel, MessagesModel
from src.users.models import UsersModel

class ChatsRepository:
    async def get_chat_by_users_id(self, user1_id: UUID, user2_id: UUID, session: AsyncSession):
        query = select(ChatsModel).where(ChatsModel.user1_id == user1_id, ChatsModel.user2_id == user2_id)
        result = await session.execute(query)
        chat = result.scalar_one_or_none()
        return chat
    
    async def create_chat(self, chat: ChatsModel, session: AsyncSession):
        session.add(chat)
        await session.commit()
        await session.refresh(chat)
        return chat
    
    async def get_user_chats(self, user_id: UUID, skip: int, limit: int, session: AsyncSession):
        unread_messages_count = select(func.count(MessagesModel.id)).where(
            MessagesModel.chat_id == ChatsModel.id, MessagesModel.sender_id != user_id, MessagesModel.is_read.is_(False)).scalar_subquery().label(
                "unread_messages_count")
        query = select(ChatsModel, unread_messages_count).where(
            or_(ChatsModel.user1_id == user_id, ChatsModel.user2_id == user_id)).options(
                selectinload(ChatsModel.user1), selectinload(ChatsModel.user2)).offset(skip).limit(limit)
        result = await session.execute(query)
        chats = result.all()
        count_query = select(func.count(ChatsModel.id)).where(
            or_(ChatsModel.user1_id == user_id, ChatsModel.user2_id == user_id))
        count_result = await session.execute(count_query)
        count = count_result.scalar_one()
        return chats, count
    
    async def get_chat_by_id(self, chat_id: UUID, session: AsyncSession):
        query = select(ChatsModel).where(ChatsModel.id == chat_id)
        result = await session.execute(query)
        chat = result.scalar_one_or_none()
        return chat
    
    async def delete_chat(self, chat: ChatsModel, session: AsyncSession):
        await session.delete(chat)
        await session.commit()

    async def create_message(self, message: MessagesModel, session: AsyncSession):
        session.add(message)
        await session.flush()
        return message
    
    async def get_messages_file_ids(self, chat_id: UUID, session: AsyncSession):
        query = select(MessagesModel.image_file_id).where(MessagesModel.chat_id == chat_id, MessagesModel.image_file_id.is_not(None))
        result = await session.execute(query)
        file_ids = result.scalars().all()
        return file_ids
    
    async def get_message_by_id(self, message_id: UUID, session: AsyncSession):
        query = select(MessagesModel).where(MessagesModel.id == message_id)
        result = await session.execute(query)
        message = result.scalar_one_or_none()
        return message
    
    async def delete_message(self, message: MessagesModel, session: AsyncSession):
        replies_query = update(MessagesModel).where(MessagesModel.parent_id == message.id).values(parent_id=None)
        await session.execute(replies_query)
        await session.delete(message)
        await session.commit()

    async def get_message_by_id_with_chat(self, message_id: UUID, session: AsyncSession):
        query = select(MessagesModel).where(MessagesModel.id == message_id).options(selectinload(MessagesModel.chat), selectinload(MessagesModel.sender))
        result = await session.execute(query)
        message = result.scalar_one_or_none()
        return message
    
    async def get_message_by_id_with_sender(self, message_id: UUID, session: AsyncSession):
        query = select(MessagesModel).where(MessagesModel.id == message_id).options(selectinload(MessagesModel.sender))
        result = await session.execute(query)
        message = result.scalar_one_or_none()
        return message
    
    async def get_chat_messages(self, chat_id: UUID, current_user: UsersModel, skip: int, limit: int, session: AsyncSession):
        is_owner = exists().where(UsersModel.id == MessagesModel.sender_id, UsersModel.id == current_user.id).label("is_owner")
        query = select(MessagesModel, is_owner).where(MessagesModel.chat_id == chat_id).order_by(
            MessagesModel.created_at.desc()).offset(skip).limit(limit).options(selectinload(MessagesModel.sender))
        result = await session.execute(query)
        messages = result.all()
        count_query = select(func.count(MessagesModel.id)).where(MessagesModel.chat_id == chat_id)
        count_result = await session.execute(count_query)
        count = count_result.scalar_one()
        return messages, count
    
    async def read_messages(self, chat_id: UUID, current_user_id: UUID, session: AsyncSession):
        query = update(MessagesModel).where(MessagesModel.chat_id == chat_id, MessagesModel.sender_id != current_user_id, MessagesModel.is_read.is_(False)).values(is_read=True)
        await session.execute(query)
        await session.commit()