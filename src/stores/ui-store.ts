import { create } from "zustand";

interface UIState {
  newKeyword: string;
  setNewKeyword: (keyword: string) => void;
  resetNewKeyword: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  newKeyword: "",
  setNewKeyword: (keyword) => set({ newKeyword: keyword }),
  resetNewKeyword: () => set({ newKeyword: "" }),
}));
