from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, Response, Request
from uuid import UUID
from datetime import datetime, timezone, timedelta

from src.auth.models import UsersModel, RefreshTokenModel
from src.auth.schemas import UserRegister, UserLogin, UserStatus
from src.auth.security import hash_password, hash_token, verify_password
from src.auth.repository import AuthRepository
from src.auth.jwt import create_access_token, create_email_verification_token, create_refresh_token, decode_token
from src.auth.email import send_verification_email
from src.configs import settings
from src.users.repository import UsersRepository

class AuthService:
    def __init__(self, auth_repo: AuthRepository, users_repo: UsersRepository):
        self.auth_repo = auth_repo
        self.users_repo = users_repo

    async def create_and_send_verification_email(self, user):
        token = create_email_verification_token({"sub": str(user.id)})
        email_verification_link = f"{settings.VERIFY_EMAIL_URL}?token={token}"
        await send_verification_email(user.email, email_verification_link)

    async def register_user(self, user: UserRegister, session: AsyncSession):
        existing_email = await self.users_repo.get_by_email(user.email, session)
        if existing_email:
            if existing_email.status == UserStatus.active or existing_email.status == UserStatus.banned:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
            elif existing_email.status == UserStatus.pending:
                await self.create_and_send_verification_email(existing_email)
                return {"message": "An account with this email has already been created, but not confirmed. We have sent a new verification link."}
        existing_username = await self.users_repo.get_by_username(user.username, session)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already in use"
            )
        user_dict = user.model_dump(exclude={"password", "password_confirm"})
        user_dict["hashed_password"] = hash_password(user.password)
        user = UsersModel(**user_dict)
        created_user = await self.auth_repo.register_user(user, session)
        await self.create_and_send_verification_email(created_user)
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
        user = await self.users_repo.get_by_id(user_uuid, session)
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
        existing_user = await self.users_repo.get_by_email(user.email, session)
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
        if existing_user.status == UserStatus.banned:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is banned"
            )
        if existing_user.status == UserStatus.pending:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is not verified"
            )
        access_token = create_access_token({"sub": str(existing_user.id)})
        refresh_token = create_refresh_token({"sub": str(existing_user.id)})
        await self.add_refresh_token(existing_user.id, refresh_token, session)
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
    
    async def add_refresh_token(self, user_id: UUID, refresh_token: str, session: AsyncSession):
        hashed_refresh_token = hash_token(refresh_token)
        refresh_token = RefreshTokenModel(
            user_id=user_id,
            hashed_token=hashed_refresh_token,
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        await self.auth_repo.add_refresh_token(refresh_token, session)

    async def refresh_access_token(self, request: Request, session: AsyncSession):
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token not found"
            )
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
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
        hashed_refresh_token = hash_token(refresh_token)
        db_refresh_token = await self.auth_repo.get_refresh_token(hashed_refresh_token, session)
        if not db_refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session not found or already logged out"
            )
        if db_refresh_token.expires_at < datetime.now(timezone.utc):
            await self.auth_repo.delete_refresh_token(db_refresh_token, session)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired"
            )
        user = await self.users_repo.get_by_id(user_uuid, session)
        if not user or user.status != UserStatus.active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        new_access_token = create_access_token({"sub": str(user.id)})
        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }
    
    async def logout(self, request: Request, response: Response, session: AsyncSession):
        refresh_token = request.cookies.get("refresh_token")
        if refresh_token:
            hashed_token = hash_token(refresh_token)
            db_hashed_token = await self.auth_repo.get_refresh_token(hashed_token, session)
            if db_hashed_token:
                await self.auth_repo.delete_refresh_token(db_hashed_token, session)
        response.delete_cookie("refresh_token", path="/auth")
        return {"message": "Logged out successfully"}
    
    async def logout_all_devices(self, response: Response, current_user: UsersModel, session: AsyncSession):
        response.delete_cookie("refresh_token", path="/auth")
        await self.auth_repo.delete_all_refresh_tokens(current_user.id, session)
        return {"message": "Logged out from all devices"}
    
    async def resend_verification_email(self, email: str, session: AsyncSession):
        user = await self.users_repo.get_by_email(email, session)
        await self.create_and_send_verification_email(user)
        return{"message": "We have sent a new verification link. Please check your email."}