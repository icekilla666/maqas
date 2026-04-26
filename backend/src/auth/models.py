from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, ForeignKey, TIMESTAMP
from uuid import uuid4
from datetime import datetime, timezone

from src.database import Base

class RefreshTokenModel(Base):
     __tablename__ = "refresh_tokens"
     id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
     user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
     hashed_token: Mapped[str] = mapped_column(String(255), nullable=False)
     created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
     expires_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
     user: Mapped["UsersModel"] = relationship("UsersModel", back_populates="refresh_tokens")