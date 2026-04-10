from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Enum, ForeignKey, TIMESTAMP, Boolean
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
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    hashed_password: Mapped[str] = mapped_column(String(255))
    status: Mapped[Enum] = mapped_column(Enum(UserStatus, name="user_status_enum", native_enum=False), nullable=False, default=UserStatus.deactivated)
    refresh_tokens: Mapped[list["RefreshTokenModel"]] = relationship("RefreshTokenModel", back_populates="user", cascade="all, delete-orphan")

class RefreshTokenModel(Base):
     __tablename__ = "refresh_tokens"
     id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
     user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
     hashed_token: Mapped[str] = mapped_column(String(255), nullable=False)
     created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
     expires_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
     user: Mapped["UserModel"] = relationship("UserModel", back_populates="refresh_tokens")