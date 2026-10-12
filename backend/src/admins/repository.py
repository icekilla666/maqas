from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, exists, literal
from sqlalchemy.orm import contains_eager
from src.users.models import UsersModel

class AdminsRepository:
    pass