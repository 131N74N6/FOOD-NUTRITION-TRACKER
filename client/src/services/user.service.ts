import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IUser, IUserService } from "../models/user.model";
import { useNavigate } from "react-router-dom";
import { useUserrStore } from "../stores/user.store";
import { useRef } from "react";

export default function UserServices(props?: IUserService) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const editUser = useUserrStore((state) => state.editUser);
    const setEditUser = useUserrStore((state) => state.setEditUser);

    const deletedImage = useUserrStore((state) => state.deletedImage);
    const setDeletedImage = useUserrStore((state) => state.setDeletedImage);

    const editMode = useUserrStore((state) => state.editMode);
    const setEditMode = useUserrStore((state) => state.setEditMode);
    const resetEditMode = useUserrStore((state) => state.resetEditMode);

    const selectedImage = useUserrStore((state) => state.selectedImage);
    const setSelectedImage = useUserrStore((state) => state.setSelectedImage);

    const selectedImageUrl = useUserrStore((state) => state.selectedImageUrl);
    const setSelectedImageUrl = useUserrStore((state) => state.setSelectedImageUrl);

    const { data: currentUser, error: currentUserError, isLoading: isCurrentUserLoading } = useQuery<IUser | null>({
        queryKey: ['current-user'],
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/show`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                });

                if (!request.ok) return null;
                return await request.json();
            } catch (error) {
                return null;
            }
        },
        refetchOnMount: true,
        refetchOnReconnect: true,
        staleTime: Infinity
    });

    const changeUserMt = useMutation({
        mutationFn: async () => {
            try {
                if (deletedImage && deletedImage.public_id) {
                    const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/rm-profile`, {
                        body: JSON.stringify({
                            imageToDelete: deletedImage
                        }),
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        method: 'DELETE'
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    await response;
                }

                const formData = new FormData();
                formData.append("username", editUser.username.trim());
                if (selectedImage) formData.append("file", selectedImage);

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/remake`, {
                    credentials: 'include',
                    method: 'PUT',
                    body: formData
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error: any) {
                throw error;
            }
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`current-user`] });
            resetEditMode();
            setDeletedImage(null);
            setSelectedImage(null);
            setSelectedImageUrl(null);
        }
    });

    const deleteUserMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/rm`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'DELETE'
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error: any) {
                throw error;
            }
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (queryKey.length > 0 && Array.isArray(query) && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith(`results`) ||
                        queryKey[0].startsWith(`result`) ||
                        queryKey[0].startsWith(`current-user`);
                    }
                    return false;
                }
            });
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            resetEditMode();
            setDeletedImage(null);
            setSelectedImage(null);
            setSelectedImageUrl(null);
            navigate('/sign-in');
        }
    });

    const isProcessing = changeUserMt.isPending || deleteUserMt.isPending;

    const showSelectedImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedImage(file!);
        const previewUrl = URL.createObjectURL(file as Blob);
        setSelectedImageUrl(previewUrl);
        if (inputFileRef.current) inputFileRef.current.value = '';
    }

    return { 
        currentUserError, 
        currentUser, 
        changeUserMt, 
        deletedImage,
        deleteUserMt, 
        editMode,
        editUser, 
        inputFileRef,
        isCurrentUserLoading, 
        isProcessing, 
        resetEditMode,
        selectedImage, 
        selectedImageUrl,
        setDeletedImage,
        setEditMode,
        setEditUser, 
        setSelectedImage, 
        setSelectedImageUrl,
        showSelectedImage
    }
}