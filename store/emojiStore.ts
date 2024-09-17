import { create } from "zustand";

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
}

interface EmojiStore {
  emojis: Emoji[];
  addEmoji: (emoji: Emoji) => void;
  setEmojis: (emojis: Emoji[]) => void;
}

export const useEmojiStore = create<EmojiStore>((set) => ({
  emojis: [],
  addEmoji: (emoji) => set((state) => ({ emojis: [emoji, ...state.emojis] })),
  setEmojis: (emojis) => set({ emojis }),
}));
