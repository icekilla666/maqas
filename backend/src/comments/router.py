from fastapi import APIRouter, status, Query
from uuid import UUID

from src.common.schemas import ResponseSchema, PaginatedResponseSchema
from src.comments.schemas import CommentOutFull, CommentCreate, CommentUpdate, CommentOutShort
from src.auth.dependencies import AuthDep, OptionalAuthDep
from src.database import SessionDep
from src.comments.dependencies import CommentsServiceDep

comments_router = APIRouter(prefix="/comments", tags=["comments"])

@comments_router.post("/post/{post_id}", response_model=ResponseSchema[CommentOutFull], status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: UUID,
    comment: CommentCreate,
    current_user: AuthDep,
    session: SessionDep,
    comments_service: CommentsServiceDep
):
    created_comment = await comments_service.create_comment(post_id, comment, current_user, session)
    return created_comment

@comments_router.get("/post/{post_id}", response_model=PaginatedResponseSchema[list[CommentOutShort]], status_code=status.HTTP_200_OK)
async def get_post_comments(
    post_id: UUID,
    optional_user: OptionalAuthDep,
    session: SessionDep,
    comments_service: CommentsServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    comments = await comments_service.get_post_comments(post_id, optional_user, skip, limit, session)
    return comments

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

@comments_router.get("/{comment_id}", response_model=ResponseSchema[CommentOutFull], status_code=status.HTTP_200_OK)
async def get_full_comment(
    comment_id: UUID,
    optional_user: OptionalAuthDep,
    session: SessionDep,
    comments_service: CommentsServiceDep
):
    comment = await comments_service.get_full_comment(comment_id, optional_user, session)
    return comment

@comments_router.get("/{comment_id}/replies", response_model=PaginatedResponseSchema[list[CommentOutShort]], status_code=status.HTTP_200_OK)
async def get_comment_replies(
    comment_id: UUID,
    optional_user: OptionalAuthDep,
    session: SessionDep,
    comments_service: CommentsServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    replies = await comments_service.get_comment_replies(comment_id, optional_user, skip, limit, session)
    return replies