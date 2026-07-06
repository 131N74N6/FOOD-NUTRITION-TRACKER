import { create } from "zustand";

export interface AnalyzeState {
    selectedImage: string | null;
    setSelectedImage: (selectedImage: string | null) => void;
}

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
    selectedImage: "",
    setSelectedImage: (selectedImage) => set({ selectedImage }),
}));