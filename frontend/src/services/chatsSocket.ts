let socket: WebSocket | null = null;

export const setChatSocket = (connection: WebSocket | null) => {
  socket = connection;
};

export const sendTyping = (chatId: string, isTyping: boolean): boolean => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: isTyping
        ? "chat.typing.started"
        : "chat.typing.stopped",
      data: { chat_id: chatId },
    }),
  );

  return true;
};