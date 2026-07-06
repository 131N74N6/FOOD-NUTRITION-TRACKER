export interface IAddData<T> {
    api_url: string;
    data: Omit<T, '_id'>;
}

export interface IChangeData<T> {
    api_url: string;
    data: Partial<Omit<T, '_id'>>;
}

export interface IDeleteData {
    api_url: string;
}

export interface IGetData {
    api_url: string;
    enabled?: boolean;
    stale_time: number;
    query_key: string[];
}

export interface InfiniteScrollIntrf {
    api_url: string;
    enabled?: boolean;
    limit: number;
    stale_time: number;
    query_key: string[];
}