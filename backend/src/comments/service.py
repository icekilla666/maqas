from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status, HTTPException

from src.comments.repository import CommentsRepository
from src.posts.repository import PostsRepository
from src.comments.schemas import CommentCreate, CommentOutFull
from src.users.models import UsersModel
from src.comments.models import CommentsModel

class CommentsService:
    def __init__(self, comments_repo: CommentsRepository, posts_repo: PostsRepository):
        self.comments_repo = comments_repo
        self.posts_repo = posts_repo

    async def create_comment(self, post_id: UUID, comment: CommentCreate, current_user: UsersModel, session: AsyncSession):
        post_rows = await self.posts_repo.get_by_id(post_id, current_user, session)
        if not post_rows:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Пост не найден",
                    "error": "POST_NOT_FOUND"
                }
            )
        post, is_liked = post_rows
        post.comments_count += 1
        if comment.parent_id:
            parent = await self.comments_repo.get_by_id(comment.parent_id, session)
            if not parent:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "success": False,
                        "message": "Комментарий не найден",
                        "error": "PARENT_COMMENT_NOT_FOUND"
                    }
                )
            parent.replies_count += 1
            comment_model = CommentsModel(
                content=comment.content,
                parent=parent,
                user=current_user,
                post=post
            )
        else:
            comment_model = CommentsModel(
                content=comment.content,
                user=current_user,
                post=post
            )
        created_comment = await self.comments_repo.create_comment(comment_model, session)
        created_comment_full_rows = await self.comments_repo.get_by_id_full(created_comment.id, current_user, session)
        created_comment_full, is_owner = created_comment_full_rows
        created_comment_full_validated = CommentOutFull.model_validate(created_comment_full)
        created_comment_full_validated.is_owner = is_owner
        return {
            "success": True,
            "data": created_comment_full_validated
        }