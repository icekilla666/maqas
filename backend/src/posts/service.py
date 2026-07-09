from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile, HTTPException, status
import re
from uuid import UUID

from src.posts.repository import PostsRepository
from src.posts.schemas import PostCreate, PostUpdate, PostOutShort, FeedType, FeedSort, PostTags, PostOutFull
from src.users.models import UsersModel
from src.common.images import upload_image, delete_image
from src.posts.models import PostsModel, HashtagsModel, TagsModel
from src.users.repository import UsersRepository

class PostsService:
    def __init__(self, posts_repo: PostsRepository, users_repo: UsersRepository):
        self.posts_repo = posts_repo
        self.users_repo = users_repo

    async def create_post(self, post: PostCreate, image: None | UploadFile, current_user: UsersModel, session: AsyncSession):
        hashtags = re.findall(r"#([a-zA-Zа-яА-ЯёЁ0-9_]+)", post.content)
        hashtags_models = []
        for hashtag in hashtags:
            existing_hashtag = await self.posts_repo.get_hashtag(hashtag, session)
            if existing_hashtag:
                hashtags_models.append(existing_hashtag)
            else:
                hashtag_model = HashtagsModel(hashtag=hashtag)
                created_hashtag = await self.posts_repo.create_hashtag(hashtag_model, session)
                hashtags_models.append(created_hashtag)
        tags_models = []
        for tag in post.tags:
            existing_tag = await self.posts_repo.get_tag(tag, session)
            if existing_tag:
                tags_models.append(existing_tag)
            else:
                tag_model = TagsModel(tag=tag)
                created_tag = await self.posts_repo.create_tag(tag_model, session)
                tags_models.append(created_tag)
        post_model = PostsModel(
            title = post.title,
            content = post.content,
            tags = tags_models,
            hashtags = hashtags_models,
            user = current_user
        )
        post_entity = await self.posts_repo.create_post(post_model, current_user.id, session)
        if image and image.filename:
            try: 
                uploaded_image = await upload_image(image, "post", post_entity.id)
                post_entity.image_url = uploaded_image["url"]
                post_entity.image_file_id = uploaded_image["file_id"]
            except Exception:
                await session.rollback()
                raise
        await session.commit()
        return {
            "success": True,
            "data": post_entity
        }
    
    async def update_post(self, post_id: UUID, update_data: PostUpdate, image_removed, image: None | UploadFile, current_user: UsersModel, session: AsyncSession):
        rows = await self.posts_repo.get_by_id(post_id, current_user, session)
        if not rows:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Пост не найден",
                    "error": "POST_NOT_FOUND"
                }
            )
        post, is_liked = rows
        if image_removed:
            await delete_image(post.image_file_id)
            if image:
                uploaded_image = await upload_image(image, "post", post.id)
                post.image_file_id = uploaded_image["file_id"]
                post.image_url = uploaded_image["url"]
            else:
                post.image_file_id = None
                post.image_url = None
        if update_data.title:
            post.title = update_data.title
        if update_data.content:
            post.content = update_data.content
            hashtags = re.findall(r"#([a-zA-Zа-яА-ЯёЁ0-9_]+)", post.content)
            hashtags_models = []
            for hashtag in hashtags:
                existing_hashtag = await self.posts_repo.get_hashtag(hashtag, session)
                if existing_hashtag:
                    hashtags_models.append(existing_hashtag)
                else:
                    hashtag_model = HashtagsModel(hashtag=hashtag)
                    created_hashtag = await self.posts_repo.create_hashtag(hashtag_model, session)
                    hashtags_models.append(created_hashtag)
            post.hashtags = hashtags_models
        if update_data.tags:
            tags_models = []
            for tag in update_data.tags:
                existing_tag = await self.posts_repo.get_tag(tag, session)
                if existing_tag:
                    tags_models.append(existing_tag)
                else:
                    tag_model = TagsModel(tag=tag)
                    created_tag = await self.posts_repo.create_tag(tag_model, session)
                    tags_models.append(created_tag)
            post.tags = tags_models
        await session.commit()
        post = PostOutFull.model_validate(post)
        post.is_liked = is_liked
        return {
            "success": True,
            "data": post
        }
    
    async def get_by_id(self, post_id: UUID, optional_user: None | UsersModel, session: AsyncSession):
        rows = await self.posts_repo.get_by_id(post_id, optional_user, session)
        if not rows:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Пост не найден",
                    "error": "POST_NOT_FOUND"
                }
            )
        post, is_liked = rows
        post = PostOutFull.model_validate(post)
        post.is_liked = is_liked
        return {
            "success": True,
            "data": post
        }
    
    async def delete_post(self, post_id: UUID, current_user: UsersModel, session: AsyncSession):
        rows = await self.posts_repo.get_by_id(post_id, session)
        if not rows:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Пост не найден",
                    "error": "POST_NOT_FOUND"
                }
            )
        post, is_liked = rows
        if post.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нет прав на действие",
                    "error": "NOT_ALLOWED"
                }
            )
        await delete_image(post.image_file_id)
        await self.posts_repo.delete_post(post, current_user.id, session)
        return {
            "success": True,
            "message": "Пост удален"
        }
    
    def _convert_rows_to_posts(self, rows: None | list[tuple[PostsModel, str]]):
        posts = []
        for post, preview, is_liked in rows:
            posts.append(
                PostOutShort(
                    id=post.id,
                    title=post.title,
                    preview=preview,
                    tags=post.tags,
                    hashtags=post.hashtags,
                    image_url=post.image_url,
                    created_at=post.created_at,
                    user=post.user,
                    likes_count=post.likes_count,
                    is_liked=is_liked
                )
            )
        return posts
    
    async def get_users_posts(self, user_id: UUID, optional_user: None | UsersModel, skip: int, limit: int, session: AsyncSession):
        user = await self.users_repo.get_by_id(user_id, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Аккаунт не найден",
                    "error": "USER_NOT_FOUND"
                }
            )
        rows, count = await self.posts_repo.get_users_posts(user_id, optional_user, skip, limit, session)
        posts = self._convert_rows_to_posts(rows)
        return {
            "success": True,
            "data": posts,
            "total": count,
            "skip": skip,
            "limit": limit
        }
    
    async def get_my_posts(self, current_user: UsersModel, skip: int, limit: int, session: AsyncSession):
        rows, count = await self.posts_repo.get_users_posts(current_user.id, current_user, skip, limit, session)
        posts = self._convert_rows_to_posts(rows)
        return {
            "success": True,
            "data": posts,
            "total": count,
            "skip": skip,
            "limit": limit
        }
    
    async def get_feed(self, feed_type: FeedType, search_query: None | str, tags: None | list[PostTags], sort: FeedSort, skip: int, limit: int, optional_user: None | UsersModel, session: AsyncSession):
        if feed_type == FeedType.following and not optional_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Не выполнен вход в аккаунт",
                    "error": "UNAUTHORIZED"
                }
            )
        hashtag = None
        if search_query:
            hashtag = re.search(r"#([a-zA-Zа-яА-ЯёЁ0-9_]+)", search_query)
            if hashtag:
                search_query = None
        rows, count = await self.posts_repo.get_feed(feed_type, search_query, hashtag, tags, sort, skip, limit, optional_user, session)
        posts = self._convert_rows_to_posts(rows)
        return {
            "success": True,
            "data": posts,
            "total": count,
            "skip": skip,
            "limit": limit
        }