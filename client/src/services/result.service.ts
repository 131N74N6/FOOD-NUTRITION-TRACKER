import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useAnalyzeStore } from "../stores/result.store";
import DataService from "./data.service";
import type { IResultService } from "../models/result.model";
import AuthService from "./auth.service";

export default function ResultService(props?: IResultService) {
    const queryClient = useQueryClient();
    const { currentUser, isCurrentUserLoading } = AuthService();
    const { deleteData, getData, infiniteScroll, insertData } = DataService();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectedImage = useAnalyzeStore((state) => state.selectedImage);
    const setSelectedImage = useAnalyzeStore((state) => state.setSelectedImage);

    const analyzeMt = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("file", selectedImage!);

            await insertData({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/results/analyze`,
                data: formData
            });
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`results-${currentUser?.user_id}`] });
        }
    });

    const cancelSelectedImage = () => {
        setSelectedImage(null);
    }

    const deleteAllResultsMt = useMutation({
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/results/rm-all` });
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
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/results/rm/${props?.id}` });
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
        const previewUrl = URL.createObjectURL(file as Blob);
        setSelectedImage(previewUrl);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const { paginatedData, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = infiniteScroll({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/results/show-all`,
        enabled: !!currentUser?.user_id && !isCurrentUserLoading,
        limit: 14,
        query_key: [`results-${currentUser?.user_id}`],
        stale_time: Infinity
    });

    const { data, error: detailError, isLoading: isDetailLoading } = getData({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/results/show`,
        enabled: !!props?.id && !isCurrentUserLoading,
        query_key: [`result-${props?.id}`],
        stale_time: Infinity
    });

    return {
        getAllResults: { paginatedData, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading },
        getResult: { data, detailError, isDetailLoading }, analyzeMt, deleteAllResultsMt, deleteResultMt,
        cancelSelectedImage, handleSelectedFile, selectedImage, fileInputRef,
        isProcessing: analyzeMt.isPending || deleteResultMt.isPending || deleteAllResultsMt.isPending,
    }
}