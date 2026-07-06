import { create } from "zustand";

export interface AnalyzeState {
    result: string | null;
    selectedImage: File | null; 
    selectedImageUrl: string | null;

    resetResult: () => void;
    setResult: (result: string | null) => void;
    setSelectedImage: (selectedImageUrl: File | null) => void;
    setSelectedImageUrl: (selectedImageUrl: string | null) => void;
}

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
    result: "",
    selectedImage: null,
    selectedImageUrl: "",

    resetResult: () => set({ result: null, selectedImageUrl: null }),
    setResult: (result) => set({ result }),
    setSelectedImage: (selectedImage) => set({ selectedImage }),
    setSelectedImageUrl: (selectedImageUrl) => set({ selectedImageUrl }),
}));