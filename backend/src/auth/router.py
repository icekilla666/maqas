from fastapi import APIRouter, status, Response, Request

from src.auth.schemas import UserRegister, UserLogin, UserEmail
from src.database import SessionDep
from src.auth.dependencies import AuthServiceDep, AuthDep

auth_router = APIRouter(prefix="/auth", tags=["authentication"])

@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    user: UserRegister,
    session: SessionDep,
    auth_service: AuthServiceDep
):
    register_data = await auth_service.register_user(user, session)
    return register_data

@auth_router.get("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    token: str,
    session: SessionDep,
    auth_service: AuthServiceDep
):
    verification_data = await auth_service.verify_email(token, session)
    return verification_data

@auth_router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(
    user: UserLogin,
    response: Response,
    session: SessionDep,
    auth_service: AuthServiceDep
):
    login_data = await auth_service.login_user(user, response, session)
    return login_data

@auth_router.post("/refresh-access", status_code=status.HTTP_201_CREATED)
async def refresh_access_token(
    request: Request,
    session: SessionDep,
    auth_service: AuthServiceDep
):
    access_token_data = await auth_service.refresh_access_token(request, session)
    return access_token_data

@auth_router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    request: Request,
    response: Response,
    session: SessionDep,
    auth_service: AuthServiceDep
):
    logout_data = await auth_service.logout(request, response, session)
    return logout_data

@auth_router.post("/logout-all", status_code=status.HTTP_200_OK)
async def logout_all_devices(
    response: Response,
    session: SessionDep,
    current_user: AuthDep,
    auth_service: AuthServiceDep
):
    logout_all_devices_data = await auth_service.logout_all_devices(response, current_user, session)
    return logout_all_devices_data

@auth_router.post("/resend-verification-email", status_code=status.HTTP_200_OK)
async def resend_verification_email(
    user_email: UserEmail,
    session: SessionDep,
    auth_service: AuthServiceDep
):
    resend_verification_email_data = await auth_service.resend_verification_email(user_email.email, session)
    return resend_verification_email_data

