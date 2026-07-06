import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useAnalyzeStore } from "../stores/result.store";
import type { IResult, IResultService } from "../models/result.model";
import AuthService from "./auth.service";

export default function ResultService(props?: IResultService) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { currentUser, isCurrentUserLoading } = AuthService();

    const selectedImage = useAnalyzeStore((state) => state.selectedImage);
    const setSelectedImage = useAnalyzeStore((state) => state.setSelectedImage);

    const selectedImageUrl = useAnalyzeStore((state) => state.selectedImageUrl);
    const setSelectedImageUrl = useAnalyzeStore((state) => state.setSelectedImageUrl);

    const result = useAnalyzeStore((state) => state.result);
    const resetResult = useAnalyzeStore((state) => state.resetResult);
    const setResult = useAnalyzeStore((state) => state.setResult);

    const analyzeMt = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("file", selectedImage!, selectedImage?.name);

            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/results/analyze`, {
                    credentials: 'include',
                    method: 'POST',
                    body: formData
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: (response) => {
            setResult(response.message);
            queryClient.invalidateQueries({ queryKey: [`results-${currentUser?.user_id}`] });
        }
    });

    const cancelSelectedImageUrl = () => {
        setSelectedImageUrl(null);
    }

    const deleteAllResultsMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/results/rm-all`, {
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
            queryClient.invalidateQueries({ queryKey: [`result-${props?.id}`] });
            queryClient.invalidateQueries({ queryKey: [`results-${currentUser?.user_id}`] });
        }
    });

    const deleteResultMt = useMutation({
        mutationFn: async (id: string) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/results/rm/${id}`, {
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
            queryClient.invalidateQueries({ queryKey: [`result-${props?.id}`] });
            queryClient.invalidateQueries({ queryKey: [`results-${currentUser?.user_id}`] });
        }
    });

    const handleSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedImage(file!);

        const previewUrl = URL.createObjectURL(file as Blob);
        setSelectedImageUrl(previewUrl);

        if (fileInputRef.current) fileInputRef.current.value = '';
    }

   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        enabled: !!currentUser && !!currentUser.user_id && !isCurrentUserLoading,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/results/show-all?page=${pageParam}&limit=${14}`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                });
                
                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        queryKey: [`results-${currentUser?.user_id}`],
        initialPageParam: 1,
        refetchOnReconnect: true,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const paginatedresult: IResult[] = data ? data.pages.flat() : [];

    const { data: resultDetail, error: detailError, isLoading: isDetailLoading } = useQuery({
        enabled: !!props?.id && !isCurrentUserLoading,
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/results/show`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error: any) {
                throw error;
            }
        },
        queryKey: [`result-${props?.id}`],
        refetchOnReconnect: true,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    return {
        getAllResults: { paginatedresult, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading },
        getResult: { resultDetail, detailError, isDetailLoading }, analyzeMt, deleteAllResultsMt, deleteResultMt,
        cancelSelectedImageUrl, handleSelectedFile, selectedImageUrl, fileInputRef, resetResult, result, setResult,
        isProcessing: analyzeMt.isPending || deleteResultMt.isPending || deleteAllResultsMt.isPending,
    }
}