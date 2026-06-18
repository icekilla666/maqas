from fastapi import APIRouter, status, Query
from uuid import UUID

from src.likes.dependencies import LikesServiceDep
from src.common.schemas import ResponseSchema, PaginatedResponseSchema
from src.auth.dependencies import AuthDep
from src.database import SessionDep
from src.posts.schemas import PostOutShort
from src.users.schemas import UserOutShort

likes_router = APIRouter(prefix="/likes", tags=["likes"])

@likes_router.get("/me", response_model=PaginatedResponseSchema[list[PostOutShort]], status_code=status.HTTP_200_OK)
async def get_my_liked_posts(
    current_user: AuthDep,
    session: SessionDep,
    likes_service: LikesServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    liked_posts = await likes_service.get_my_liked_posts(current_user, skip, limit, session)
    return liked_posts

@likes_router.post("/{post_id}", response_model=ResponseSchema, status_code=status.HTTP_201_CREATED)
async def like_post(
    post_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    likes_service: LikesServiceDep
):
    like_data = await likes_service.like_post(post_id, current_user, session)
    return like_data

@likes_router.delete("/{post_id}", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def unlike_post(
    post_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    likes_service: LikesServiceDep
):
    unlike_data = await likes_service.unlike_post(post_id, current_user, session)
    return unlike_data

@likes_router.get("/{post_id}", response_model=PaginatedResponseSchema[list[UserOutShort]], status_code=status.HTTP_200_OK)
async def get_post_likers(
    post_id: UUID,
    session: SessionDep,
    likes_service: LikesServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    post_likers = await likes_service.get_post_likers(post_id, skip, limit, session)
    return post_likers