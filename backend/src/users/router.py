from fastapi import APIRouter, status, Response, UploadFile, Query
from uuid import UUID

from src.users.schemas import UserOutMe, UserUpdateMe, UserOutShort, UserOutFull, UserOutShortSearch
from src.auth.dependencies import AuthDep, OptionalAuthDep
from src.database import SessionDep
from src.users.dependencies import UsersServiceDep
from src.common.schemas import ResponseSchema, PaginatedResponseSchema

users_router = APIRouter(prefix="/users", tags=["users"])

@users_router.get("/me", response_model=ResponseSchema[UserOutMe], status_code=status.HTTP_200_OK)
async def get_me(
    current_user: AuthDep
):
    return {
        "success": True,
        "data": current_user
    }

@users_router.patch("/me", response_model=ResponseSchema[UserOutMe], status_code=status.HTTP_200_OK)
async def update_me(
    update_data: UserUpdateMe,
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep
):
    updated_user = await users_service.update_me(update_data, current_user, session)
    return updated_user

@users_router.post("/me", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def delete_me(
    current_user: AuthDep,
    response: Response,
    session: SessionDep,
    users_service: UsersServiceDep
):
    delete_data = await users_service.delete_me(response, current_user, session)
    return delete_data

@users_router.post("/me/avatar", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def upload_avatar(
    file: UploadFile,
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep
):
    file_url = await users_service.upload_avatar(file, current_user, session)
    return file_url

@users_router.delete("/me/avatar", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def delete_avatar(
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep
):
    delete_avatar_data = await users_service.delete_avatar(current_user, session)
    return delete_avatar_data

@users_router.get("/", response_model=PaginatedResponseSchema[list[UserOutShortSearch]], status_code=status.HTTP_200_OK)
async def get_by_similar_username(
    username: str,
    optional_user: OptionalAuthDep,
    session: SessionDep,
    users_service: UsersServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    users = await users_service.get_by_similar_username(username, optional_user, skip, limit, session)
    return users

@users_router.get("/me/followers", response_model=PaginatedResponseSchema[list[UserOutShort]], status_code=status.HTTP_200_OK)
async def get_my_followers(
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    followers = await users_service.get_my_followers(current_user, skip, limit, session)
    return followers

@users_router.get("/me/followings", response_model=PaginatedResponseSchema[list[UserOutShort]], status_code=status.HTTP_200_OK)
async def get_my_followings(
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    followings = await users_service.get_my_followings(current_user, skip, limit, session)
    return followings

@users_router.get("/me/blacklist", response_model=PaginatedResponseSchema[list[UserOutShort]], status_code=status.HTTP_200_OK)
async def get_my_blacklist(
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    blacklist = await users_service.get_my_blacklist(current_user, skip, limit, session)
    return blacklist

@users_router.get("/{user_id}", response_model=ResponseSchema[UserOutFull], status_code=status.HTTP_200_OK)
async def get_by_id(
    optional_user: OptionalAuthDep,
    user_id: UUID,
    session: SessionDep,
    users_service: UsersServiceDep
):
    user = await users_service.get_by_id(optional_user, user_id, session)
    return user

@users_router.post("/{user_id}/follow", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def follow_user(
    user_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep
):
    follow_user_data = await users_service.follow_user(current_user, user_id, session)
    return follow_user_data

@users_router.delete("/{user_id}/unfollow", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def unfollow_user(
    user_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    users_service: UsersServiceDep
):
    unfollow_user_data = await users_service.unfollow_user(current_user, user_id, session)
    return unfollow_user_data

@users_router.get("/{user_id}/followers", response_model=PaginatedResponseSchema[list[UserOutShort]], status_code=status.HTTP_200_OK)
async def get_followers(
    user_id: UUID,
    session: SessionDep,
    users_service: UsersServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    followers = await users_service.get_followers(user_id, skip, limit, session)
    return followers

@users_router.get("/{user_id}/followings", response_model=PaginatedResponseSchema[list[UserOutShort]], status_code=status.HTTP_200_OK)
async def get_followings(
    user_id: UUID,
    session: SessionDep,
    users_service: UsersServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    followings = await users_service.get_followings(user_id, skip, limit, session)
    return followings

@users_router.post("/{user_id}/block", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def block_user(
    current_user: AuthDep,
    user_id: UUID, 
    session: SessionDep,
    users_service: UsersServiceDep
):
    block_data = await users_service.block_user(current_user, user_id, session)
    return block_data

@users_router.delete("/{user_id}/unblock", response_model=ResponseSchema, status_code=status.HTTP_200_OK)
async def unblock_user(
    current_user: AuthDep,
    user_id: UUID, 
    session: SessionDep,
    users_service: UsersServiceDep
):
    unblock_data = await users_service.unblock_user(current_user, user_id, session)
    return unblock_data