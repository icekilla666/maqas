from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from datetime import datetime

from src.users.schemas import UserOutShort

class CommentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=1000)
    parent_id: UUID | None = Field(default=None)

class CommentOutFull(BaseModel):
    id: UUID
    content: None | str = Field(default=None, max_length=1000)
    is_deleted: bool = Field(default=False)
    replies_count: int = Field(default=0, ge=0)
    parent_id: UUID | None = Field(default=None)
    created_at: datetime
    is_owner: bool = Field(default=False)
    user: UserOutShort
    model_config = ConfigDict(from_attributes=True)

class CommentUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=1000)

class CommentOutShort(BaseModel):
    id: UUID
    preview: None | str = Field(default=None, min_length=1, max_length=50)
    is_deleted: bool = Field(default=False)
    replies_count: int = Field(default=0, ge=0)
    parent_id: UUID | None = Field(default=None)
    created_at: datetime
    is_owner: bool = Field(default=False)
    user: UserOutShort
    model_config = ConfigDict(from_attributes=True)