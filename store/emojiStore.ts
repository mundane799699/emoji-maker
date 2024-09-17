import { create } from "zustand";

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  isLiked: boolean;
}

interface EmojiStore {
  emojis: Emoji[];
  isSignInModalOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  addEmoji: (emoji: Emoji) => void;
  setEmojis: (emojis: Emoji[]) => void;
}

export const useEmojiStore = create<EmojiStore>((set) => ({
  emojis: [],
  isSignInModalOpen: false,
  onOpen: () => set({ isSignInModalOpen: true }),
  onClose: () => set({ isSignInModalOpen: false }),
  addEmoji: (emoji) => set((state) => ({ emojis: [emoji, ...state.emojis] })),
  setEmojis: (emojis) => set({ emojis }),
}));
