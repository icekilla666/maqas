from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status, HTTPException, Response

from src.auth.models import UsersModel
from src.users.repository import UsersRepository
from src.users.schemas import UserUpdateMe, UserStatus
from src.auth.repository import AuthRepository

class UsersService:
    def __init__(self, users_repo: UsersRepository, auth_repo: AuthRepository):
        self.users_repo = users_repo
        self.auth_repo = auth_repo
    
    async def update_me(self, update_data: UserUpdateMe, current_user: UsersModel, session: AsyncSession):
        existing_username = await self.users_repo.get_by_username(update_data.username, session)
        if existing_username and existing_username.username != current_user.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already in use"
            )
        update_dict = update_data.model_dump(exclude_unset=True)
        for k, v in update_dict.items():
            setattr(current_user, k, v)
        await session.commit()
        return current_user
    
    async def delete_me(self, response: Response, current_user: UsersModel, session: AsyncSession):
        response.delete_cookie("refresh_token", path="/auth")
        await self.auth_repo.delete_all_refresh_tokens(current_user.id, session)
        current_user.email = f"deleted_{current_user.id}@deleted.local"
        current_user.username = f"deleted_{current_user.id}"
        current_user.status = UserStatus.deactivated
        await session.commit()
        return {"message": "Account deleted successfully"}