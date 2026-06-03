from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.posts.models import PostsModel, HashtagsModel, TagsModel

class PostsRepository:
    async def create_post(self, post: PostsModel, session: AsyncSession):
        session.add(post)
        await session.flush()
        return post 
    
    async def get_hashtag(self, hashtag: str, session: AsyncSession):
        query = select(HashtagsModel).where(HashtagsModel.hashtag == hashtag)
        result = await session.execute(query)
        hashtag = result.scalar_one_or_none()
        return hashtag
    
    async def create_hashtag(self, hashtag: HashtagsModel, session: AsyncSession):
        session.add(hashtag)
        await session.flush()
        return hashtag

    async def get_tag(self, tag: str, session: AsyncSession):
        query = select(TagsModel).where(TagsModel.tag == tag)
        result = await session.execute(query)
        tag = result.scalar_one_or_none()
        return tag
    
    async def create_tag(self, tag: TagsModel, session: AsyncSession):
        session.add(tag)
        await session.flush()
        return tag
    
    async def get_by_id(self, post_id: UUID, session: AsyncSession):
        query = select(PostsModel).where(PostsModel.id == post_id).options(selectinload(PostsModel.hashtags), selectinload(PostsModel.tags), selectinload(PostsModel.user))
        result = await session.execute(query)
        post = result.scalar_one_or_none()
        return post
    
    