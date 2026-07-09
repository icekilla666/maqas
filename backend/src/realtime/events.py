from enum import StrEnum

class RealtimeEventType(StrEnum):
    CHAT_MESSAGE_CREATED = "chat.message.created"
    CHAT_MESSAGE_READ = "chat.message.read"
    CHAT_MESSAGE_DELETED = "chat.message.deleted"
    CHAT_MESSAGE_UPDATED = "chat.message.updated"

    CHAT_TYPING_STARTED = "chat.typing.started"
    CHAT_TYPING_STOPPED = "chat.typing.stopped"

    CHAT_CONNECTED = "chat.connected"
    CHAT_USER_ONLINE = "chat.user.online"
    CHAT_USER_OFFLINE = "chat.user.offline"