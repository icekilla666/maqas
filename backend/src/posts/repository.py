from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, exists
from sqlalchemy.orm import selectinload

from src.posts.models import PostsModel, HashtagsModel, TagsModel, PostHashtagModel
from src.posts.schemas import FeedSort, FeedType, PostTags
from src.users.models import UsersModel, FollowsModel

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
    
    async def delete_post(self, post: PostsModel, session: AsyncSession):
        await session.delete(post)
        await session.commit()

    async def get_users_posts(self, user_id: UUID, skip: int, limit: int, session: AsyncSession):
        query = select(PostsModel, func.left(PostsModel.content, 150).label("preview")).where(PostsModel.user_id == user_id).options(selectinload(PostsModel.hashtags), selectinload(PostsModel.tags), selectinload(PostsModel.user)).offset(skip).limit(limit)
        result = await session.execute(query)
        posts = result.all()
        count_query = select(func.count(PostsModel.id)).where(PostsModel.user_id == user_id)
        count_result = await session.execute(count_query)
        count = count_result.scalar_one()
        return posts, count
    
    async def _filter_feed(self, query, feed_type: FeedType, search_query: None | str, hashtag: None | str, tags: None | list[PostTags], sort: FeedSort, optional_user: None | UsersModel, session: AsyncSession):
        if feed_type == FeedType.following:
            query = query.where(exists().where(FollowsModel.following_id == PostsModel.user_id).where(FollowsModel.follower_id == optional_user.id))
        if hashtag:
            query = query.where(PostsModel.hashtags.any(HashtagsModel.hashtag.ilike(f"%{hashtag}%")))
        if tags:
            query = query.where(PostsModel.tags.any(TagsModel.tag.in_(tags)))
        if search_query:
            query = query.where(func.similarity(PostsModel.title, search_query) > 0.2).order_by(func.similarity(PostsModel.title, search_query).desc())
        return query
    
    async def get_feed(self, feed_type: FeedType, search_query: None | str, hashtag: None | str, tags: None | list[PostTags], sort: FeedSort, skip: int, limit: int, optional_user: None | UsersModel, session: AsyncSession):
        query = select(PostsModel, func.left(PostsModel.content, 150).label("preview"))
        query = await self._filter_feed(query, feed_type, search_query, hashtag, tags, sort, optional_user, session)
        if sort == FeedSort.new:
            query = query.order_by(PostsModel.created_at.desc())
        elif sort == FeedSort.old:
            query = query.order_by(PostsModel.created_at.asc())
        query = query.options(selectinload(PostsModel.hashtags), selectinload(PostsModel.tags), selectinload(PostsModel.user)).offset(skip).limit(limit)
        result = await session.execute(query)
        feed = result.all()
        count_query = select(func.count(PostsModel.id))
        count_query = await self._filter_feed(count_query, feed_type, search_query, hashtag, tags, sort, optional_user, session)
        count_query = count_query.order_by(None)
        count_result = await session.execute(count_query)
        count = count_result.scalar_one()
        return feed, count