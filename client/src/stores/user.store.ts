import { create } from "zustand";
import type { ISignIn, ISignUp, IUser } from "../models/user.model";

export interface UserState {
    deletedImage: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    editMode: boolean;
    editUser: IUser;
    selectedImage: File | null;
    selectedImageUrl: string | null;
    signIn: ISignIn;
    signUp: ISignUp;

    resetSignIn: () => void;
    resetSignUp: () => void;
    resetEditMode: () => void;
    setDeletedImage: (deletedImage: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
    setEditMode: (editMode: boolean) => void;
    setEditUser: (key: 'created_at'| 'email' | 'profile_picture' | 'user_id' | 'username', value: string) => void;
    setSelectedImage: (selectedImage: File | null) => void;
    setSelectedImageUrl: (selectedImageUrl: string | null) => void;
    setSignIn: (key: 'password' | 'username', value: string) => void;
    setSignUp: (key: 'email' | 'password' | 'username', value: string) => void;
}

export const useUserrStore = create<UserState>((set) => ({
    deletedImage: null,
    editMode: false,
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
    selectedImageUrl: null,
    signIn: {
        password: "",
        username: ""
    },
    signUp: {
        email: "",
        password: "",
        username: ""
    },

    resetEditMode: () => set({ 
        deletedImage: null,
        editMode: false, 
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
        selectedImageUrl: null
    }),
    resetSignIn: () => set({ signIn: { password: "", username: "" } }),
    resetSignUp: () => set({ signUp: { email: "", password: "", username: "" } }),
    setDeletedImage: (deletedImage) => set({ deletedImage }),
    setEditMode: (editMode) => set({ editMode }),
    setEditUser: (key, value) => set((state) => ({ editUser: { ...state.editUser, [key]: value } })),
    setSelectedImage: (selectedImage) => set({ selectedImage }),
    setSelectedImageUrl: (selectedImageUrl) => set({ selectedImageUrl }),
    setSignIn: (key, value) => set((state) => ({ signIn: { ...state.signIn, [key]: value } })),
    setSignUp: (key, value) => set((state) => ({ signUp: { ...state.signUp, [key]: value } }))
}));