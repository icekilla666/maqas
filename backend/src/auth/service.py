from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, Response, Request
from uuid import UUID
from datetime import datetime, timezone, timedelta

from src.auth.models import RefreshTokenModel
from src.users.models import UsersModel
from src.auth.schemas import UserRegister, UserLogin
from src.users.schemas import UserStatus
from src.auth.security import hash_password, hash_token, verify_password
from src.auth.repository import AuthRepository
from src.auth.jwt import create_access_token, create_email_verification_token, create_refresh_token, decode_token, decode_email_verification_token
from src.auth.email import send_verification_email
from src.configs import settings
from src.users.repository import UsersRepository

class AuthService:
    def __init__(self, auth_repo: AuthRepository, users_repo: UsersRepository):
        self.auth_repo = auth_repo
        self.users_repo = users_repo

    async def create_and_send_verification_email(self, user):
        token = create_email_verification_token({"sub": str(user.email)})
        email_verification_link = f"{settings.VERIFY_EMAIL_URL}?token={token}"
        await send_verification_email(user.email, email_verification_link)

    async def register_user(self, user: UserRegister, session: AsyncSession):
        if user.password != user.password_confirm:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Пароль не совпадает",
                    "error": "PASSWORDS_DO_NOT_MATCH"
                }
            )
        existing_email = await self.users_repo.get_by_email(user.email, session)
        if existing_email:
            if existing_email.status == UserStatus.active or existing_email.status == UserStatus.banned:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={
                        "success": False,
                        "message": "Email занят",
                        "error": "EMAIL_IN_USE"
                    }
                )
            elif existing_email.status == UserStatus.pending:
                await self.create_and_send_verification_email(existing_email)
                return {
                    "success": True,
                    "message": "Учётная запись с таким email уже существует, но не подтверждена. Новая ссылка для подтверждения отправлена"
                    }
        existing_username = await self.users_repo.get_by_username(user.username, session)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Имя пользователя занято",
                    "error": "USERNAME_IN_USE"
                }
            )
        user_dict = user.model_dump(exclude={"password", "password_confirm"})
        user_dict["hashed_password"] = hash_password(user.password)
        user = UsersModel(**user_dict)
        created_user = await self.auth_repo.register_user(user, session)
        await self.create_and_send_verification_email(created_user)
        return {
            "success": True,
            "message": "Регистрация прошла успешно! Пожалуйста, проверьте вашу почту и подтвердите аккаунт.",
            "data": created_user.email
        }

    async def verify_email(self, token: str, session: AsyncSession):
        token_info = decode_email_verification_token(token)
        if not token_info["payload"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Ссылка недействительна",
                    "error": "INVALID_TOKEN"
                }
            )
        if token_info["payload"].get("type") != "email_verification":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Ссылка недействительна",
                    "error": "WRONG_TOKEN_TYPE"
                }
            )
        user_email = token_info["payload"].get("sub")
        if not user_email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Ссылка недействительна",
                    "error": "INVALID_TOKEN_STRUCTURE"
                }
            )
        user = await self.users_repo.get_by_email(user_email, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "success": False,
                    "message": "Ссылка недействительна",
                    "error": "USER_NOT_FOUND"
                }
            )
        if user.status == UserStatus.banned:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Аккаунт заблокирован",
                    "error": "USER_BANNED"
                }
            )
        if user.status == UserStatus.active:
            return {
                "success": True,
                "message": "Email уже подтверждён",
            }
        if token_info["status"] == "expired":
            return {
                "success": False,
                "message": "Срок действия ссылки истек",
                "data": user.email
            }
        user.status = UserStatus.active
        await session.commit()
        return {
            "success": True,
            "message": "Аккаунт успешно активирован"
        }

    async def login_user(self, user: UserLogin, response: Response, session: AsyncSession):
        existing_user = await self.users_repo.get_by_email(user.email, session)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Неверный email или пароль",
                    "error": "WRONG_EMAIL_OR_PASSWORD"
                }
            )
        if not verify_password(user.password, existing_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Неверный email или пароль",
                    "error": "WRONG_EMAIL_OR_PASSWORD"
                }
            )
        if existing_user.status == UserStatus.banned:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Аккаунт заблокирован",
                    "error": "USER_BANNED"
                }
            )
        if existing_user.status == UserStatus.pending:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Аккаунт не подтверждён",
                    "error": "USER_PENDING"
                }
            )
        access_token = create_access_token({"sub": str(existing_user.id)})
        refresh_token = create_refresh_token({"sub": str(existing_user.id)})
        await self.add_refresh_token(existing_user.id, refresh_token, session)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False, # local     
            samesite="lax",
            path="/"
        )
        return {
            "success": True,
            "data": {
                "access_token": access_token,
                "token_type": "bearer",
                "user_id": str(existing_user.id),
                "email": existing_user.email
            }
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
                detail={
                    "success": False,
                    "message": "Не выполнен вход в аккаунт",
                    "error": "REFRESH_TOKEN_NOT_FOUND"
                }
            )
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Не выполнен вход в аккаунт",
                    "error": "INVALID_REFRESH_TOKEN"
                }
            )
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Не выполнен вход в аккаунт",
                    "error": "INVALID_TOKEN_STRUCTURE"
                }
            )
        try:
            user_uuid = UUID(user_id_str)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Не выполнен вход в аккаунт",
                    "error": "INVALID_ID_IN_TOKEN"
                }
            )
        hashed_refresh_token = hash_token(refresh_token)
        db_refresh_token = await self.auth_repo.get_refresh_token(hashed_refresh_token, session)
        if not db_refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Не выполнен вход в аккаунт",
                    "error": "SESSION_NOT_FOUND"
                }
            )
        if db_refresh_token.expires_at < datetime.now(timezone.utc):
            await self.auth_repo.delete_refresh_token(db_refresh_token, session)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Не выполнен вход в аккаунт",
                    "error": "REFRESH_TOKEN_EXPIRED"
                }
            )
        user = await self.users_repo.get_by_id(user_uuid, session)
        if not user or user.status != UserStatus.active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Аккаунт не найден",
                    "error": "USER_NOT_FOUND"
                }
            )
        new_access_token = create_access_token({"sub": str(user.id)})
        return {
            "success": True,
            "data": {
                "access_token": new_access_token,
                "token_type": "bearer"
            }
        }
    
    async def logout(self, request: Request, response: Response, session: AsyncSession):
        refresh_token = request.cookies.get("refresh_token")
        if refresh_token:
            hashed_token = hash_token(refresh_token)
            db_hashed_token = await self.auth_repo.get_refresh_token(hashed_token, session)
            if db_hashed_token:
                await self.auth_repo.delete_refresh_token(db_hashed_token, session)
        response.delete_cookie("refresh_token", path="/")
        return {
            "success": True,
            "message": "Выход выполнен успешно"
        }
    
    async def logout_all_devices(self, response: Response, current_user: UsersModel, session: AsyncSession):
        response.delete_cookie("refresh_token", path="/")
        await self.auth_repo.delete_all_refresh_tokens(current_user.id, session)
        return {
            "success": True,
            "message": "Выполнен выход на всех устройствах"
        }
    
    async def resend_verification_email(self, email: str, session: AsyncSession):
        user = await self.users_repo.get_by_email(email, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Аккаунт не найден",
                    "error": "USER_NOT_FOUND"
                }
            )
        await self.create_and_send_verification_email(user)
        return {
            "success": True,
            "message": "Мы отправили новую ссылку для подтверждения. Пожалуйста, проверьте вашу почту."
        }