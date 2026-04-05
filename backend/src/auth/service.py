from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, Response, Request
from uuid import UUID

from src.auth.models import UserModel
from src.auth.schemas import UserRegister, UserLogin, UserStatus
from src.auth.security import hash_password, verify_password
from src.auth.repository import AuthRepository
from src.auth.jwt import create_access_token, create_email_verification_token, create_refresh_token, decode_token
from src.auth.email import send_verification_email
from src.configs import settings

class AuthService:
    def __init__(self, repo: AuthRepository):
        self.repo = repo

    async def register_user(self, user: UserRegister, session: AsyncSession):
        existing_email = await self.repo.get_by_email(user.email, session)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        existing_username = await self.repo.get_by_username(user.username, session)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already in use"
            )
        user_dict = user.model_dump(exclude={"password", "password_confirm"})
        user_dict["hashed_password"] = hash_password(user.password)
        user = UserModel(**user_dict)
        created_user = await self.repo.register_user(user, session)
        token = create_email_verification_token({"sub": str(created_user.id)})
        email_verification_link = f"{settings.VERIFY_EMAIL_URL}?token={token}"
        await send_verification_email(created_user.email, email_verification_link)
        return {"message": "User created successfully, please check your email to verify your account"}

    async def verify_email(self, token: str, session: AsyncSession):
        payload = decode_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired token"
            )
        if payload.get("type") != "email_verification":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        try:
            user_uuid = UUID(user_id_str)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user id in token"
            )
        user = await self.repo.get_by_id(user_uuid, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if user.status == UserStatus.banned:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is banned"
            )
        if user.status == UserStatus.active:
            return {"message": "Email is already verified"}
        user.status = UserStatus.active
        await session.commit()
        return {"message": "Account activated successfully"}

    async def login_user(self, user: UserLogin, response: Response, session: AsyncSession):
        existing_user = await self.repo.get_by_email(user.email, session)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        if not verify_password(user.password, existing_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        if existing_user.status == UserStatus.deactivated:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is not active"
            )
        if existing_user.status == UserStatus.banned:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is banned"
            )
        access_token = create_access_token({"sub": str(existing_user.id)})
        refresh_token = create_refresh_token({"sub": str(existing_user.id)})
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False, #local     
            samesite="lax",
            path="/auth"
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(existing_user.id),
            "email": existing_user.email
        }
    async def refresh(self, request: Request, session: AsyncSession):
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found"
            )
        payload = decode_token(refresh_token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
            )

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        user_id_str = payload.get("sub")
        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        try:
            user_uuid = UUID(user_id_str)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user id in token"
            )
        user = await self.repo.get_by_id(user_uuid, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if user.status != UserStatus.active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is not active"
            )
        access_token = create_access_token({"sub": str(user.id)})
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    async def logout(self, response: Response):
        response.delete_cookie("refresh_token", path="/auth")
        return