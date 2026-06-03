from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile, HTTPException, status
import re
from uuid import UUID

from src.posts.repository import PostsRepository
from src.posts.schemas import PostCreate, PostUpdate
from src.users.models import UsersModel
from src.common.images import upload_image, delete_image
from src.posts.models import PostsModel, HashtagsModel, TagsModel

class PostsService:
    def __init__(self, posts_repo: PostsRepository):
        self.posts_repo = posts_repo

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
        post_entity = await self.posts_repo.create_post(post_model, session)
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
        post = await self.posts_repo.get_by_id(post_id, session)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Пост не найден",
                    "error": "POST_NOT_FOUND"
                }
            )
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
        return {
            "success": True,
            "data": post
        }