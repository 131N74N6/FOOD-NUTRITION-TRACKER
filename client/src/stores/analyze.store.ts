import { create } from "zustand";

export interface AnalyzeState {
    selectedImage: string;
    setSelectedImage: (selectedImage: string) => void;
}

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
    selectedImage: "",
    setSelectedImage: (selectedImage) => set({ selectedImage }),
}));