from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status, HTTPException

from src.comments.repository import CommentsRepository
from src.posts.repository import PostsRepository
from src.comments.schemas import CommentCreate, CommentOut, CommentUpdate
from src.users.models import UsersModel
from src.comments.models import CommentsModel
from src.users.repository import UsersRepository

class CommentsService:
    def __init__(self, comments_repo: CommentsRepository, posts_repo: PostsRepository, users_repo: UsersRepository):
        self.comments_repo = comments_repo
        self.posts_repo = posts_repo
        self.users_repo = users_repo

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
        post, _ = post_rows
        block = await self.users_repo.get_block(post.user_id, current_user.id, session)
        if block:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Пользователь заблокировал вас",
                    "error": "BLOCKED"
                }
            )
        if comment.parent_id:
            parent = await self.comments_repo.get_by_id(comment.parent_id, session)
            if not parent or parent.is_deleted:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "success": False,
                        "message": "Комментарий не найден",
                        "error": "PARENT_COMMENT_NOT_FOUND"
                    }
                )
            if parent.post_id != post_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={
                        "success": False,
                        "message": "Комментарий принадлежит другому посту",
                        "error": "OTHER_POST_ID"
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
        post.comments_count += 1
        created_comment = await self.comments_repo.create_comment(comment_model, session)
        created_comment_full_rows = await self.comments_repo.get_by_id_with_owner(created_comment.id, current_user, session)
        created_comment_full, is_owner = created_comment_full_rows
        created_comment_full_validated = CommentOut.model_validate(created_comment_full)
        created_comment_full_validated.is_owner = is_owner
        return {
            "success": True,
            "data": created_comment_full_validated
        }
    
    async def delete_comment(self, comment_id: UUID, current_user: UsersModel, session: AsyncSession):
        comment = await self.comments_repo.get_by_id_with_post(comment_id, session)
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Комментарий не найден",
                    "error": "COMMENT_NOT_FOUND"
                }
            )
        if comment.user_id != current_user.id and comment.post.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя удалить чужой комментарий",
                    "error": "ANOTHER_USER'S_COMMENT"
                }
            )
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
            parent.replies_count -= 1
            if parent.replies_count == 0 and parent.is_deleted:
                await self.comments_repo.delete_comment(parent, session)
        if comment.replies_count == 0:
            await self.comments_repo.delete_comment(comment, session)
        else:
            comment.content = None
            comment.is_deleted = True
        comment.post.comments_count -= 1
        await session.commit()
        return {
            "success": True,
            "message": "Комментарий удален"
        }
        
    async def update_comment(self, comment_id: UUID, comment_data: CommentUpdate, current_user: UsersModel, session: AsyncSession):
        comment_rows = await self.comments_repo.get_by_id_with_owner(comment_id, current_user, session)
        if not comment_rows:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Комментарий не найден",
                    "error": "COMMENT_NOT_FOUND"
                }
            )
        comment, is_owner = comment_rows
        if comment.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя изменить чужой комментарий",
                    "error": "ANOTHER_USER'S_COMMENT"
                }
            )
        if comment.is_deleted:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Нельзя редактировать удаленный комментарий",
                    "error": "DELETED_COMMENT"
                }
            )
        if comment_data.content:
            comment.content = comment_data.content
            comment.is_edited = True
            await session.commit()
        comment_full = CommentOut.model_validate(comment)
        comment_full.is_owner = is_owner
        return {
            "success": True,
            "data": comment_full
        }
    def _convert_rows_to_comments(self, rows: None | list[tuple[CommentsModel, bool]]):
        comments = []
        for comment, is_owner in rows:
            comment_complete = CommentOut.model_validate(comment)
            comment_complete.is_owner = is_owner
            comments.append(comment_complete)
        return comments

    async def get_post_comments(self, post_id: UUID, optional_user: None | UsersModel, skip: int, limit: int, session: AsyncSession):
        post_rows = await self.posts_repo.get_by_id(post_id, optional_user, session)
        if not post_rows:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Пост не найден",
                    "error": "POST_NOT_FOUND"
                }
            )
        comments_rows, count = await self.comments_repo.get_post_comments(post_id, optional_user, skip, limit, session)
        comments = self._convert_rows_to_comments(comments_rows)
        return {
            "success": True,
            "data": comments,
            "total": count,
            "skip": skip,
            "limit": limit
        }

    async def get_comment_replies(self, comment_id: UUID, optional_user: None | UsersModel, skip: int, limit: int, session: AsyncSession):
        comment = await self.comments_repo.get_by_id(comment_id, session)
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Комментарий не найден",
                    "error": "COMMENT_NOT_FOUND"
                }
            )
        replies_rows = await self.comments_repo.get_comment_replies(comment_id, optional_user, skip, limit, session)
        replies = self._convert_rows_to_comments(replies_rows)
        return {
            "success": True,
            "data": replies,
            "total": comment.replies_count,
            "skip": skip,
            "limit": limit
        }