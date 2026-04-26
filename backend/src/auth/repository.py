from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from uuid import UUID

from src.auth.models import RefreshTokenModel
from src.users.models import UsersModel

class AuthRepository:
    async def register_user(self, user: UsersModel, session: AsyncSession):
        session.add(user)
        await session.commit()
        await session.refresh(user)
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
        
    async def delete_all_refresh_tokens(self, user_id: UUID, session: AsyncSession):
        query = delete(RefreshTokenModel).where(RefreshTokenModel.user_id == user_id)
        await session.execute(query)
        await session.commit()