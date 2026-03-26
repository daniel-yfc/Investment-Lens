import { create } from 'zustand';
import { UIMessage } from '@ai-sdk/react';

interface ChatState {
  messages: UIMessage[];
  isLoading: boolean;
  activeSkill: string | null;
  addMessage: (message: UIMessage) => void;
  setLoading: (loading: boolean) => void;
  setActiveSkill: (skill: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  activeSkill: null,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveSkill: (activeSkill) => set({ activeSkill }),
}));
