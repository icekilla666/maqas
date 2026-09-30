import { create } from "zustand";

interface ChatsRealtimeState {
  typingByChat: Partial<Record<string, string>>;
  setTyping: (chatId: string, userId: string) => void;
  clearTyping: (chatId: string) => void;
  resetTyping: () => void;
}

export const useChatsRealtimeStore = create<ChatsRealtimeState>((set) => ({
  typingByChat: {},
  setTyping: (chatId, userId) => set((state) => {
    if (state.typingByChat[chatId] === userId) return state;
    return { typingByChat: { ...state.typingByChat, [chatId]: userId } };
  }),
  clearTyping: (chatId) => set((state) => {
    if (!state.typingByChat[chatId]) return state;
    const typingByChat = { ...state.typingByChat };
    delete typingByChat[chatId];
    return { typingByChat };
  }),
  resetTyping: () => set({ typingByChat: {} }),
}));
