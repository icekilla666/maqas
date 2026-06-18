from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from sqlalchemy.orm import selectinload

from src.likes.models import LikesModel
from src.posts.models import PostsModel
from src.users.models import UsersModel

class LikesRepository:
    async def get_post_like(self, post_id: UUID, user_id: UUID, session: AsyncSession):
        query = select(LikesModel).where(LikesModel.post_id == post_id, LikesModel.user_id == user_id)
        result = await session.execute(query)
        post_like = result.scalar_one_or_none()
        return post_like
    
    async def like_post(self, like: LikesModel, session: AsyncSession):
        post_query = update(PostsModel).where(PostsModel.id == like.post_id).values(likes_count=PostsModel.likes_count + 1)
        await session.execute(post_query)
        session.add(like)
        await session.commit()

    async def unlike_post(self, like: LikesModel, session: AsyncSession):
        post_query = update(PostsModel).where(PostsModel.id == like.post_id).values(likes_count=PostsModel.likes_count - 1)
        await session.execute(post_query)
        await session.delete(like)
        await session.commit()

    async def get_users_posts_likes(self, user_id: UUID, skip: int, limit: int, session: AsyncSession):
        query = select(PostsModel, func.left(PostsModel.content, 150).label("preview")).join(
            LikesModel, LikesModel.post_id == PostsModel.id).where(LikesModel.user_id == user_id).options(
                selectinload(PostsModel.hashtags), selectinload(PostsModel.tags), selectinload(PostsModel.user)).offset(skip).limit(limit)
        result = await session.execute(query)
        posts = result.all()
        count_query = select(func.count(PostsModel.id)).join(LikesModel, LikesModel.post_id == PostsModel.id).where(LikesModel.user_id == user_id)
        count_result = await session.execute(count_query)
        count = count_result.scalar_one()
        return posts, count
    
    async def get_post_likers(self, post_id: UUID, skip: int, limit: int, session: AsyncSession):
        query = select(UsersModel).join(LikesModel, LikesModel.user_id == UsersModel.id).where(LikesModel.post_id == post_id).offset(skip).limit(limit)
        result = await session.execute(query)
        post_likers = result.scalars().all()
        return post_likers