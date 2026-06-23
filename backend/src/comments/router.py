from fastapi import APIRouter, status
from uuid import UUID

from src.common.schemas import ResponseSchema, PaginatedResponseSchema
from src.comments.schemas import CommentOutFull, CommentCreate, CommentUpdate
from src.auth.dependencies import AuthDep
from src.database import SessionDep
from src.comments.dependencies import CommentsServiceDep

comments_router = APIRouter(prefix="/comments", tags=["comments"])

@comments_router.post("/{post_id}", response_model=ResponseSchema[CommentOutFull], status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: UUID,
    comment: CommentCreate,
    current_user: AuthDep,
    session: SessionDep,
    comments_service: CommentsServiceDep
):
    created_comment = await comments_service.create_comment(post_id, comment, current_user, session)
    return created_comment

@comments_router.delete("/{comment_id}", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def delete_comment(
    comment_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    comments_service: CommentsServiceDep
):
    delete_data = await comments_service.delete_comment(comment_id, current_user, session)
    return delete_data

@comments_router.patch("/{comment_id}", response_model=ResponseSchema[CommentOutFull], status_code=status.HTTP_200_OK)
async def update_comment(
    comment_id: UUID,
    comment_data: CommentUpdate,
    current_user: AuthDep,
    session: SessionDep,
    comments_service: CommentsServiceDep
):
    updated_comment = await comments_service.update_comment(comment_id, comment_data, current_user, session)
    return updated_comment