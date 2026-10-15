import { create } from "zustand";

interface ChatsRealtimeState {
  presenceReady: boolean;
  presenceByUser: Partial<Record<string, { online: boolean }>>;
  setOnlineUsers: (userIds: string[]) => void;
  setPresence: (userId: string, online: boolean) => void;
  resetPresence: () => void;
  typingByChat: Partial<Record<string, string>>;
  setTyping: (chatId: string, userId: string) => void;
  clearTyping: (chatId: string) => void;
  resetTyping: () => void;
}

export const useChatsRealtimeStore = create<ChatsRealtimeState>((set) => ({
  presenceReady: false,
  presenceByUser: {},
  setOnlineUsers: (userIds) => set({
    presenceReady: true,
    presenceByUser: Object.fromEntries(userIds.map(id => [id, { online: true }])),
  }),
  setPresence: (userId, online) => set(state => ({
    presenceByUser: {
      ...state.presenceByUser,
      [userId]: { online },
    },
  })),
  resetPresence: () => set({ presenceReady: false, presenceByUser: {} }),
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
