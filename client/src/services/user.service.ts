import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IUserService } from "../models/user.model";
import { useNavigate } from "react-router-dom";
import { useUserrStore } from "../stores/user.store";

export default function UserServices(props?: IUserService) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const editUser = useUserrStore((state) => state.editUser);
    const setEditUser = useUserrStore((state) => state.setEditUser);

    const selectedImage = useUserrStore((state) => state.selectedImage);
    const setSelectedImage = useUserrStore((state) => state.setSelectedImage);

    const changeUserMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("file", selectedImage!);
                formData.append("username", editUser.username.trim());

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
            navigate('/sign-in');
        }
    });

    const isProcessing = changeUserMt.isPending || deleteUserMt.isPending;

    return { changeUserMt, deleteUserMt, editUser, isProcessing, selectedImage, setEditUser, setSelectedImage }
}