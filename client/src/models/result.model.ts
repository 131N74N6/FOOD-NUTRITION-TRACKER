import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export interface IResult {
    _id: string;
    created_at: string;
    explanation: string;
    image: {
        public_id: string;
        resource_type: string;
        url: string;
    };
    user_id: string;
}

export interface IResultData {
    isProcessing: boolean;
    onDelete: UseMutationResult<void, Error, string, unknown>;
    result: IResult;
}

export interface IResultList {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    onDelete: UseMutationResult<void, Error, string, unknown>;
    results: IResult[]
}

export interface IResultService {
    id?: string;
    message?: string | null;
    setMessage?: (message: string | null) => void;
}