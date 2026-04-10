from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from src.auth.models import UserModel, RefreshTokenModel

class AuthRepository:
    async def register_user(self, user: UserModel, session: AsyncSession):
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
    
    async def get_by_email(self, email: str, session: AsyncSession):
        query = select(UserModel).where(UserModel.email == email)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    
    async def get_by_id(self, id: UUID, session: AsyncSession):
        query = select(UserModel).where(UserModel.id == id)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    
    async def get_by_username(self, username: str, session: AsyncSession):
        query = select(UserModel).where(UserModel.username == username)
        result = await session.execute(query)
        user = result.scalar_one_or_none()
        return user
    
    async def add_refresh_token(self, refresh_token: RefreshTokenModel, session: AsyncSession):
        session.add(refresh_token)
        await session.commit()
        await session.refresh(refresh_token)
    
    async def get_refresh_token(self, refresh_token: str, session: AsyncSession):
        query = select(RefreshTokenModel).where(RefreshTokenModel.hashed_token == refresh_token)
        result = await session.execute(query)
        refresh_token = result.scalar_one_or_none()
        return refresh_token
    
    async def delete_refresh_token(self, refresh_token: str, session: AsyncSession):
        await session.delete(refresh_token)
        await session.commit()
        
