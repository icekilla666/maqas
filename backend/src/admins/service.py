from fastapi import status, HTTPException
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from src.users.repository import UsersRepository
from src.auth.repository import AuthRepository
from src.admins.repository import AdminsRepository
from src.posts.repository import PostsRepository
from src.comments.repository import CommentsRepository
from src.users.schemas import UserStatus

class AdminsService:
    def __init__(self, admins_repo: AdminsRepository, auth_repo: AuthRepository, users_repo: UsersRepository, posts_repo: PostsRepository, comments_repo: CommentsRepository):
        self.admins_repo = admins_repo
        self.auth_repo = auth_repo
        self.users_repo = users_repo
        self.posts_repo = posts_repo
        self.comments_repo = comments_repo

    async def ban_user(self, user_id: UUID, session: AsyncSession):
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
        if user.status == UserStatus.banned:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Аккаунт уже заблокирован",
                    "error": "ALREADY_BANNED"
                }
            )
        await self.auth_repo.delete_all_refresh_tokens(user_id, session)
        user.status = UserStatus.banned
        await session.commit()
        return {
            "success": True,
            "message": "Аккаунт заблокирован"
        }
    
    async def unban_user(self, user_id: UUID, session: AsyncSession):
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
        if user.status != UserStatus.banned:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Аккаунт уже разблокирован",
                    "error": "ALREADY_UNBANNED"
                }
            )
        user.status = UserStatus.pending
        await session.commit()
        return {
            "success": True,
            "message": "Аккаунт разблокирован"
        }
    