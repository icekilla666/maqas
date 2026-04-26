from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status, HTTPException, Response, UploadFile

from src.users.models import UsersModel
from src.users.repository import UsersRepository
from src.users.schemas import UserUpdateMe, UserStatus
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
                detail="Имя пользователя уже используется"
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
        return {"message": "Аккаунт успешно удалён"}
    
    async def delete_avatar(self, current_user: UsersModel, session: AsyncSession):
        await delete_image(current_user.avatar_file_id)
        current_user.avatar_url = None
        current_user.avatar_file_id = None
        await session.commit()
        return {"message": "Аватар успешно удалён"}
    
    async def upload_avatar(self, file: UploadFile, current_user: UsersModel, session: AsyncSession):
        if current_user.avatar_url:
            await self.delete_avatar(current_user, session)
        uploaded_file = await upload_image(file, "avatar", current_user.id)
        current_user.avatar_url = uploaded_file["url"]
        current_user.avatar_file_id = uploaded_file["file_id"]
        await session.commit()
        return current_user.avatar_url