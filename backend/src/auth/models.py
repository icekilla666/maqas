from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Enum, ForeignKey, TIMESTAMP
from uuid import uuid4
from datetime import datetime, timezone

from src.database import Base
from src.auth.schemas import UserStatus

class UsersModel(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(254), unique=True, nullable=False)
    bio: Mapped[str | None] = mapped_column(String(200), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    status: Mapped[Enum] = mapped_column(Enum(UserStatus, name="user_status_enum", native_enum=False), nullable=False, default=UserStatus.pending)
    refresh_tokens: Mapped[list["RefreshTokenModel"]] = relationship("RefreshTokenModel", back_populates="user", cascade="all, delete-orphan")
    @property
    def display_username(self) -> str:
        if self.status == UserStatus.deactivated:
            return "[deleted]"
        return self.username
    @property
    def is_banned(self) -> bool:
        if self.status == UserStatus.banned:
            return True
        return False

class RefreshTokenModel(Base):
     __tablename__ = "refresh_tokens"
     id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
     user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
     hashed_token: Mapped[str] = mapped_column(String(255), nullable=False)
     created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
     expires_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
     user: Mapped["UsersModel"] = relationship("UsersModel", back_populates="refresh_tokens")