from uuid import UUID
from fastapi import status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.likes.repository import LikesRepository
from src.posts.repository import PostsRepository
from src.users.models import UsersModel
from src.likes.models import LikesModel
from src.posts.schemas import PostOutShort

class LikesService:
    def __init__(self, likes_repo: LikesRepository, posts_repo: PostsRepository):
        self.likes_repo = likes_repo
        self.posts_repo = posts_repo

    async def like_post(self, post_id: UUID, current_user: UsersModel, session: AsyncSession):
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
        if is_liked:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "success": False,
                    "message": "Лайк уже поставлен",
                    "error": "ALREADY_LIKED"
                }
            )
        like = LikesModel(
            post_id = post_id,
            user_id = current_user.id
        )
        await self.likes_repo.like_post(like, session)
        return {
            "success": True,
        }
    
    async def unlike_post(self, post_id: UUID, current_user: UsersModel, session: AsyncSession):
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
        like = await self.likes_repo.get_post_like(post_id, current_user.id, session)
        if not like:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "success": False,
                    "message": "Лайк не поставлен",
                    "error": "ALREADY_UNLIKED"
                }
            )
        await self.likes_repo.unlike_post(like, session)
        return {
            "success": True
        }
    
    async def get_my_liked_posts(self, current_user: UsersModel, skip: int, limit: int, session: AsyncSession):
        rows, count = await self.likes_repo.get_users_posts_likes(current_user.id, skip, limit, session)
        posts = []
        for post, preview in rows:
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
                    is_liked=True
                )
            )
        return {
            "success": True,
            "data": posts,
            "total": count,
            "skip": skip,
            "limit": limit
        }
    
    async def get_post_likers(self, post_id: UUID, skip: int, limit: int, session: AsyncSession):
        rows = await self.posts_repo.get_by_id(post_id, None, session)
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
        post_likers = await self.likes_repo.get_post_likers(post_id, skip, limit, session)
        return {
            "success": True,
            "data": post_likers,
            "total": post.likes_count,
            "skip": skip,
            "limit": limit
        }