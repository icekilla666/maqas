from uuid import UUID
from fastapi import WebSocket

class RealtimeConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, set[WebSocket]] = {}

    async def connect(self, user_id: UUID, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)

    def disconnect(self, user_id: UUID, websocket: WebSocket):
        user_connections = self.active_connections.get(user_id)
        if not user_connections:
            return
        user_connections.discard(websocket)
        if not user_connections:
            self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: UUID, event: dict):
        connections = self.active_connections.get(user_id)
        if not connections:
            return
        for websocket in connections:
            await websocket.send_json(event)

realtime_manager = RealtimeConnectionManager()