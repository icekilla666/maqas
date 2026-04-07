from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Enum, ForeignKey, DateTime
from uuid import uuid4
from datetime import datetime, timezone

from src.database import Base
from src.auth.schemas import UserStatus

class UserModel(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(254), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255))
    status: Mapped[Enum] = mapped_column(Enum(UserStatus, name="user_status_enum", native_enum=False), nullable=False, default=UserStatus.deactivated)
    # sessions: Mapped[list["Session"]] = relationship("Session", back_populates="users")

# class Session(Base):
#     __tablename__ = "sessions"
#     id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), default=uuid4)
#     user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True, default=uuid4)
#     hashed_token: Mapped[str] = mapped_column(String(255), nullable=False)
#     created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.UTC), nullable=False)
#     expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
#     user: Mapped["UserModel"] = relationship("UserModel", back_populates="sessions")