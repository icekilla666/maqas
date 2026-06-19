from fastapi import APIRouter, status
from uuid import UUID

from src.common.schemas import ResponseSchema, PaginatedResponseSchema
from src.comments.schemas import CommentOutFull, CommentCreate
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