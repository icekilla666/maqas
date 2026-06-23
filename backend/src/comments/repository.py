from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, exists, literal, func
from sqlalchemy.orm import selectinload

from src.users.models import UsersModel
from src.comments.models import CommentsModel

class CommentsRepository:
    async def get_by_id(self, comment_id: UUID, session: AsyncSession):
        query = select(CommentsModel).where(CommentsModel.id == comment_id)
        result = await session.execute(query)
        comment = result.scalar_one_or_none()
        return comment
    
    async def get_by_id_with_owner(self, comment_id: UUID, optional_user: None | UsersModel, session: AsyncSession):
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
    
    async def get_by_id_with_post(self, comment_id: UUID, session: AsyncSession):
        query = select(CommentsModel).where(CommentsModel.id == comment_id).options(selectinload(CommentsModel.post))
        result = await session.execute(query)
        comment = result.scalar_one_or_none()
        return comment
    
    async def delete_comment(self, comment: CommentsModel, session: AsyncSession):
        await session.delete(comment)

    async def get_post_comments(self, post_id: UUID, optional_user: None | UsersModel, skip: int, limit: int, session: AsyncSession):
        if optional_user:
            is_owner = exists().where(UsersModel.id == CommentsModel.user_id, UsersModel.id == optional_user.id).label("is_owner")
        else:
            is_owner = literal(False).label("is_owner")
        query = select(CommentsModel, func.left(CommentsModel.content, 50).label("preview"), is_owner).where(CommentsModel.post_id == post_id, CommentsModel.parent_id.is_(None)).options(selectinload(CommentsModel.user)).offset(skip).limit(limit)
        result = await session.execute(query)
        comments = result.all()
        count_query = select(func.count(CommentsModel.id)).where(CommentsModel.post_id == post_id, CommentsModel.parent_id.is_(None))
        count_result = await session.execute(count_query)
        count = count_result.scalar_one()
        return comments, count
    
    async def get_comment_replies(self, comment_id: UUID, optional_user: None | UsersModel, skip: int, limit: int, session: AsyncSession):
        if optional_user:
            is_owner = exists().where(UsersModel.id == CommentsModel.user_id, UsersModel.id == optional_user.id).label("is_owner")
        else:
            is_owner = literal(False).label("is_owner")
        query = select(CommentsModel, func.left(CommentsModel.content, 50).label("preview"), is_owner).where(CommentsModel.parent_id == comment_id).options(selectinload(CommentsModel.user)).offset(skip).limit(limit)
        result = await session.execute(query)
        replies = result.all()
        return replies