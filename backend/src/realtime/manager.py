from uuid import UUID
from fastapi import WebSocket

class RealtimeConnectionManager:
    def __init__(self):
        self.active_connections: dict[UUID, set[WebSocket]] = {}

    async def connect(self, user_id: UUID, websocket: WebSocket):
        await websocket.accept()
        was_offline = not self.active_connections.get(user_id)
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        return was_offline

    def disconnect(self, user_id: UUID, websocket: WebSocket):
        connections = self.active_connections.get(user_id)
        if not connections:
            return False
        connections.discard(websocket)
        if not connections:
            self.active_connections.pop(user_id, None)
            return True
        return False

    def is_online(self, user_id: UUID) -> bool:
        return bool(self.active_connections.get(user_id))

    def get_online_user_ids(self) -> set[UUID]:
        return {
            user_id
            for user_id, connections in self.active_connections.items()
            if connections
        }
    
    async def send_to_user(self, user_id: UUID, event: dict):
        connections = self.active_connections.get(user_id)
        if not connections:
            return

        dead_connections = []

        for websocket in connections:
            try:
                await websocket.send_json(event)
            except Exception:
                dead_connections.append(websocket)

        for websocket in dead_connections:
            self.disconnect(user_id, websocket)

realtime_manager = RealtimeConnectionManager()