from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status, HTTPException, Response, UploadFile
from uuid import UUID

from src.users.models import UsersModel, FollowsModel, BlackListModel
from src.users.repository import UsersRepository
from src.users.schemas import UserUpdateMe, UserStatus, UserOutFull
from src.auth.repository import AuthRepository
from src.common.images import upload_image, delete_image

class UsersService:
    def __init__(self, users_repo: UsersRepository, auth_repo: AuthRepository):
        self.users_repo = users_repo
        self.auth_repo = auth_repo
    
    async def update_me(self, update_data: UserUpdateMe, current_user: UsersModel, session: AsyncSession):
        existing_username = await self.users_repo.get_by_username(update_data.username, session)
        if existing_username and existing_username.username != current_user.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Имя пользователя уже используется",
                    "error": "USERNAME_IN_USE"
                }
            )
        update_dict = update_data.model_dump(exclude_unset=True)
        for k, v in update_dict.items():
            setattr(current_user, k, v)
        await session.commit()
        return {
            "success": True,
            "data": current_user
        }
    
    async def delete_me(self, response: Response, current_user: UsersModel, session: AsyncSession):
        response.delete_cookie("refresh_token", path="/auth")
        await self.auth_repo.delete_all_refresh_tokens(current_user.id, session)
        current_user.email = f"deleted_{current_user.id}@deleted.local"
        current_user.username = f"deleted_{current_user.id}"
        current_user.status = UserStatus.deactivated
        await session.commit()
        return {
            "success": True,
            "message": "Аккаунт успешно удалён"
        }
    
    async def delete_avatar(self, current_user: UsersModel, session: AsyncSession):
        await delete_image(current_user.avatar_file_id)
        current_user.avatar_url = None
        current_user.avatar_file_id = None
        await session.commit()
        return {
            "success": True,
            "message": "Аватар успешно удалён"
        }
    
    async def upload_avatar(self, file: UploadFile, current_user: UsersModel, session: AsyncSession):
        if current_user.avatar_url:
            await self.delete_avatar(current_user, session)
        uploaded_file = await upload_image(file, "avatar", current_user.id)
        current_user.avatar_url = uploaded_file["url"]
        current_user.avatar_file_id = uploaded_file["file_id"]
        await session.commit()
        return {
            "success": True,
            "data": current_user.avatar_url
        }
    
    async def get_by_id(self, optional_user: None | UsersModel, user_id: UUID, session: AsyncSession):
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
        if optional_user:
            is_blocked = await self.users_repo.get_block(user.id, optional_user.id, session)
            if is_blocked:
                user_data = UserOutFull.model_validate(user)
                user_data.is_blocked = True
                return {
                    "success": True,
                    "data": user_data
                }
            user_data, status = await self.users_repo.get_by_id_with_follow_status(user_id, optional_user.id, session)
            user_with_follow_status = UserOutFull.model_validate(user_data)
            user_with_follow_status.is_following = status
            return {
                "success": True,
                "data": user_with_follow_status
            }
        return {
                "success": True,
                "data": user
            }
    
    async def get_by_similar_username(self, username: str, optional_user: None | UsersModel, skip: int, limit: int, session: AsyncSession):
        users = await self.users_repo.get_by_similar_username(username, skip, limit, session)
        if optional_user:
            users_with_follow_status = []
            for user in users:
                user_data, status = await self.users_repo.get_by_id_with_follow_status(user.id, optional_user.id, session)
                user_with_follow_status = UserOutFull.model_validate(user_data)
                user_with_follow_status.is_following = status
                users_with_follow_status.append(user_with_follow_status)
            return {
            "success": True,
            "data": users_with_follow_status
            }
        return {
            "success": True,
            "data": users
        }
    
    async def follow_user(self, follower_user: UsersModel, following_user_id: UUID, session: AsyncSession):
        if follower_user.id == following_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Нельзя подписаться на себя ;(",
                    "error": "CANNOT_FOLLOW_SELF"
                }
            )
        following_user = await self.users_repo.get_by_id(following_user_id, session)
        if not following_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Аккаунт не найден",
                    "error": "USER_NOT_FOUND"
                }
            )
        existing_follow = await self.users_repo.get_follow(follower_user.id, following_user.id, session)
        if existing_follow:
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Вы уже подписаны",
                    "error": "FOLLOW_ALREADY_EXISTS"
                }
            )
        is_blocked = await self.users_repo.get_block(following_user.id, follower_user.id, session)
        if is_blocked:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Пользователь заблокировал вас",
                    "error": "BLOCKED"
                }
            )
        is_blocking = await self.users_repo.get_block(follower_user.id, following_user.id, session)
        if is_blocking:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": "Вы заблокировали этого пользователя",
                    "error": "BLOCKING"
                }
            )
        follow = FollowsModel(
            follower_id = follower_user.id,
            following_id = following_user.id
        )
        await self.users_repo.follow_user(follow, session)
        return {
            "success": True
        }
    
    async def unfollow_user(self, follower_user: UsersModel, following_user_id: UUID, session: AsyncSession):
        following_user = await self.users_repo.get_by_id(following_user_id, session)
        if not following_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Аккаунт не найден",
                    "error": "USER_NOT_FOUND"
                }
            )
        existing_follow = await self.users_repo.get_follow(follower_user.id, following_user_id, session)
        if not existing_follow:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Вы уже отписаны",
                    "error": "ALREADY_UNFOLLOWED"
                }
            )
        await self.users_repo.unfollow_user(existing_follow, session)
        return {
            "success": True
        }
    
    async def get_my_followers(self, current_user: UsersModel, skip: int, limit: int, session: AsyncSession):
        followers = await self.users_repo.get_followers(current_user.id, skip, limit, session)
        return {
            "success": True,
            "data": followers,
            "total": current_user.followers_count,
            "skip": skip,
            "limit": limit
        }
        
    async def get_followers(self, user_id: UUID, skip: int, limit: int, session: AsyncSession):
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
        followers = await self.users_repo.get_followers(user_id, skip, limit, session)
        return {
            "success": True,
            "data": followers,
            "total": user.followers_count,
            "skip": skip,
            "limit": limit
        }
        
    async def get_my_followings(self, current_user: UsersModel, skip: int, limit: int, session: AsyncSession):
        followings = await self.users_repo.get_followings(current_user.id, skip, limit, session)
        return {
            "success": True,
            "data": followings,
            "total": current_user.followings_count,
            "skip": skip,
            "limit": limit
        }
        
    async def get_followings(self, user_id: UUID, skip: int, limit: int, session: AsyncSession):
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
        followings = await self.users_repo.get_followings(user_id, skip, limit, session)
        return {
            "success": True,
            "data": followings,
            "total": user.followings_count,
            "skip": skip,
            "limit": limit
        }
    async def block_user(self, current_user: UsersModel, user_id: UUID, session: AsyncSession):
        if current_user.id == user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Нельзя заблокировать себя",
                    "error": "CANNOT_BLOCK_SELF"
                }
            )
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
        existing_block = await self.users_repo.get_block(current_user.id, user.id, session)
        if existing_block:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Этот пользователь уже заблокирован",
                    "error": "ALREADY_BLOCKED"
                }
            )
        block = BlackListModel(
            blocker_id = current_user.id,
            blocking_id = user.id
        )
        await self.users_repo.block_user(block, session)
        is_follower = await self.users_repo.get_follow(current_user.id, user.id, session)
        if is_follower:
            await self.users_repo.unfollow_user(is_follower, session)
        is_followed = await self.users_repo.get_follow(user.id, current_user.id, session)
        if is_followed:
            await self.users_repo.unfollow_user(is_followed, session)
        return {
            "success": True
        }
    async def unblock_user(self, current_user: UsersModel, user_id: UUID, session: AsyncSession):
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
        block = await self.users_repo.get_block(current_user.id, user.id, session)
        if not block:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Этот пользователь уже разблокирован",
                    "error": "ALREADY_UNBLOCKED"
                }
            )
        await self.users_repo.unblock_user(block, session)
        return {
            "success": True
        }
    
    async def get_my_blacklist(self, current_user: UsersModel, skip: int, limit: int, session: AsyncSession):
        blacklist, total = await self.users_repo.get_my_blacklist(current_user.id, skip, limit, session)
        return {
            "success": True,
            "data": blacklist,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    
