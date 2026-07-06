import { create } from "zustand";
import type { ISignIn, ISignUp, IUser } from "../models/user.model";

export interface UserState {
    editUser: IUser;
    selectedImage: string | null;
    signIn: ISignIn;
    signUp: ISignUp;

    resetSignIn: () => void;
    resetSignUp: () => void;

    setEditUser: (key: 'created_at'| 'email' | 'profile_picture' | 'user_id' | 'username', value: string) => void;
    setSelectedImage: (selectedImage: string | null) => void;
    setSignIn: (key: 'password' | 'username', value: string) => void;
    setSignUp: (key: 'email' | 'password' | 'username', value: string) => void;
}

export const useUserrStore = create<UserState>((set) => ({
    editUser: {
        created_at: "",
        email: "",
        profile_picture: {
            public_id: "",
            resource_type: "",
            url: ""
        },
        user_id: "",
        username: ""
    },
    selectedImage: null,
    signIn: {
        password: "",
        username: ""
    },
    signUp: {
        email: "",
        password: "",
        username: ""
    },

    resetSignIn: () => set({ signIn: { password: "", username: "" } }),
    resetSignUp: () => set({ signUp: { email: "", password: "", username: "" } }),

    setEditUser: (key, value) => set((state) => ({ editUser: { ...state.editUser, [key]: value } })),
    setSelectedImage: (selectedImage) => set({ selectedImage }),
    setSignIn: (key, value) => set((state) => ({ signIn: { ...state.signIn, [key]: value } })),
    setSignUp: (key, value) => set((state) => ({ signUp: { ...state.signUp, [key]: value } }))
}));