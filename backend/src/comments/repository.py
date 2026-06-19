from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, exists, literal
from sqlalchemy.orm import selectinload

from src.users.models import UsersModel
from src.comments.models import CommentsModel

class CommentsRepository:
    async def get_by_id(self, comment_id: UUID, session: AsyncSession):
        query = select(CommentsModel).where(CommentsModel.id == comment_id)
        result = await session.execute(query)
        comment = result.scalar_one_or_none()
        return comment
    
    async def get_by_id_full(self, comment_id: UUID, optional_user: None | UsersModel, session: AsyncSession):
        if optional_user:
            is_owner = exists().where(UsersModel.id == CommentsModel.user_id, UsersModel.id == optional_user.id).label("is_owner")
        else:
            is_owner = literal(False).label("is_owner")
        query = select(CommentsModel, is_owner).where(CommentsModel.id == comment_id).options(selectinload(CommentsModel.user))
        result = await session.execute(query)
        comment = result.one_or_none()
        return comment
    
    async def create_comment(self, comment: CommentsModel, session: AsyncSession):
        session.add(comment)
        await session.commit()
        await session.refresh(comment)
        return comment