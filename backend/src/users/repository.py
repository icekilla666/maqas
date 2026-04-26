from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.users.models import UsersModel

class UsersRepository:
    async def get_by_email(self, email: str, session: AsyncSession):
        query = select(UsersModel).where(UsersModel.email == email)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    
    async def get_by_id(self, id: UUID, session: AsyncSession):
        query = select(UsersModel).where(UsersModel.id == id)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    
    async def get_by_username(self, username: str, session: AsyncSession):
        query = select(UsersModel).where(UsersModel.username == username)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    