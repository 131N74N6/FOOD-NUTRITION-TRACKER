import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { IAddData, IChangeData, IDeleteData, IGetData, InfiniteScrollIntrf } from "../models/data.model";

export default function DataService() {
    const changeData = async <U>(props: IChangeData<U>) => {
        try {
            const request = await fetch(props.api_url, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'PUT',
                body: JSON.stringify(props.data)
            });

            const response = await request.json();
            if (!request.ok) throw new Error(response.message);
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    const deleteData = async (props: IDeleteData) => {
        try {
            const request = await fetch(props.api_url, {
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
    }

    const getData = <U>(props: IGetData): { data: U | undefined; error: Error | null; isLoading: boolean } => {
        const { data, error, isLoading } = useQuery({
            enabled: props.enabled ?? true,
            queryFn: async () => {
                try {
                    const request = await fetch(props.api_url, {
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
            queryKey: props.query_key,
            refetchOnReconnect: true,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time
        });

        return { data, error, isLoading }
    }

    const infiniteScroll = <U>(props: InfiniteScrollIntrf) => {
        const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
            enabled: props.enabled ?? true,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < props.limit) return;
                return allPages.length + 1;
            },
            queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
                try {
                    const request = await fetch(`${props.api_url}?page=${pageParam}&limit=${props.limit}`, {
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
            queryKey: props.query_key,
            initialPageParam: 1,
            refetchOnReconnect: true,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time
        });

        const paginatedData: U[] = data ? data.pages.flat() : [];
        
        return { paginatedData, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading }
    }

    const insertData = async <U>(props: IAddData<U>) => {
        try {
            const request = await fetch(props.api_url, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(props.data)
            });

            const response = await request.json();
            if (!request.ok) throw new Error(response.message);
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    return {
        changeData, deleteData, getData, infiniteScroll, insertData
    }
}