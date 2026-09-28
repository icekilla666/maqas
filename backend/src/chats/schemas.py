from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from datetime import datetime

from src.users.schemas import UserOutShort

class LastMessageOut(BaseModel):
    content: str | None
    image_url: str | None
    created_at: datetime
    is_owner: bool

class ChatOutShort(BaseModel):
    id: UUID
    is_blocking: None | bool = Field(default=False)
    is_blocked: None | bool = Field(default=False)
    model_config = ConfigDict(from_attributes=True)
    
class ChatOutFull(BaseModel):
    id: UUID
    unread_count: int = Field(ge=0)
    target_user: UserOutShort
    last_message: LastMessageOut | None
    model_config = ConfigDict(from_attributes=True)

class MessageOut(BaseModel):
    id: UUID
    chat_id: UUID
    content: None | str = Field(default=None, max_length=700)
    image_url: None | str = Field(default=None)
    is_read: bool = Field(default=False)
    created_at: datetime
    parent_id: None | UUID = Field(default=None)
    sender: UserOutShort
    is_owner: None | bool = Field(default=False)
    model_config = ConfigDict(from_attributes=True)

class MessageCreate(BaseModel):
    content: None | str = Field(default=None, max_length=700)
    parent_id: None | UUID = Field(default=None)

class MessageUpdate(BaseModel):
    content: None | str = Field(default=None, max_length=700)