from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, TIMESTAMP, Boolean, UniqueConstraint
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone

from src.database import Base

class ChatsModel(Base):
    __tablename__ = "chats"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    user1_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    user2_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    user1: Mapped["UsersModel"] = relationship("UsersModel", foreign_keys=[user1_id], back_populates="chats_as_user1")
    user2: Mapped["UsersModel"] = relationship("UsersModel", foreign_keys=[user2_id], back_populates="chats_as_user2")
    messages: Mapped[list["MessagesModel"]] = relationship("MessagesModel", back_populates="chat", cascade="all, delete-orphan")
    __table_args__ = (UniqueConstraint('user1_id', 'user2_id', name='unique_chat'),)

class MessagesModel(Base):
    __tablename__ = "messages"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    content: Mapped[str | None] = mapped_column(String(700), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    image_file_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", nullable=False)
    parent_id: Mapped[UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("messages.id"), nullable=True)
    chat_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("chats.id", ondelete="CASCADE"), nullable=False)
    sender_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    parent: Mapped["MessagesModel"] = relationship("MessagesModel", remote_side=[id], back_populates="replies")
    chat: Mapped["ChatsModel"] = relationship("ChatsModel", back_populates="messages")
    sender: Mapped["UsersModel"] = relationship("UsersModel", back_populates="messages")
    replies: Mapped[list["MessagesModel"]] = relationship("MessagesModel", back_populates="parent")