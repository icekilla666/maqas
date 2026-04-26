from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Enum
from uuid import uuid4

from src.database import Base
from src.users.schemas import UserStatus

class UsersModel(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    avatar_file_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=True)
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
