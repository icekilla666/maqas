from fastapi import APIRouter, Query, UploadFile, File, Form
from uuid import UUID

from src.auth.dependencies import AuthDep
from src.database import SessionDep
from src.chats.dependencies import ChatsServiceDep
from src.common.schemas import PaginatedResponseSchema, ResponseSchema
from src.chats.schemas import ChatOutShort, ChatOutFull, MessageOut, MessageCreate, MessageUpdate

chats_router = APIRouter(prefix="/chats", tags=["chats"])

@chats_router.post("/users/{user_id}", response_model=ResponseSchema[ChatOutShort])
async def get_or_create_chat(
    user_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    chats_service: ChatsServiceDep
):
    chat = await chats_service.get_or_create_chat(user_id, current_user, session)
    return chat

@chats_router.get("/me", response_model=PaginatedResponseSchema[list[ChatOutFull]])
async def get_my_chats(
    current_user: AuthDep,
    session: SessionDep,
    chats_service: ChatsServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    chats = await chats_service.get_my_chats(current_user, skip, limit, session)
    return chats

@chats_router.patch("/messages/{message_id}", response_model=ResponseSchema[MessageOut])
async def update_message(
    message_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    chats_service: ChatsServiceDep,
    image_removed: bool,
    image: UploadFile | None = File(None),
    update_message: str = Form(None)
):
    update_message = MessageUpdate(content=update_message)
    updated_message = await chats_service.update_message(message_id, update_message, image_removed, image, current_user, session)
    return updated_message

@chats_router.delete("/messages/{message_id}", response_model=ResponseSchema)
async def delete_message(
    message_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    chats_service: ChatsServiceDep
):
    delete_message_data = await chats_service.delete_message(message_id, current_user, session)
    return delete_message_data

@chats_router.patch("/{chat_id}/messages/read", response_model=ResponseSchema[MessageOut])
async def mark_messages_as_read(
    chat_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    chats_service: ChatsServiceDep
):
    marked_messages_data = await chats_service.mark_message_as_read(chat_id, current_user, session)
    return marked_messages_data

@chats_router.post("/{chat_id}/messages/create", response_model=ResponseSchema[MessageOut])
async def create_message(
    chat_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    chats_service: ChatsServiceDep,
    message: str | None = Form(None),
    parent_id: UUID | None = Form(None),
    image: UploadFile | None = File(None)
):  
    message = MessageCreate(content=message, parent_id=parent_id)
    created_message = await chats_service.create_message(chat_id, message, image, current_user, session)
    return created_message

@chats_router.delete("/{chat_id}", response_model=ResponseSchema)
async def delete_chat(
    chat_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    chats_service: ChatsServiceDep
):
    delete_chat_data = await chats_service.delete_chat(chat_id, current_user, session)
    return delete_chat_data

@chats_router.get("/{chat_id}", response_model=PaginatedResponseSchema[list[MessageOut]])
async def get_chat_messages(
    chat_id: UUID,
    current_user: AuthDep,
    session: SessionDep,
    chats_service: ChatsServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1)
):
    messages = await chats_service.get_chat_messages(chat_id, current_user, skip, limit, session)
    return messages