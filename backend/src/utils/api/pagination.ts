export type PaginationOptions = {
    pageNumber: number;
    pageSize: number;
};

export type PaginatedResults<T> = {
    results: T[];
    nextPageNumber: number | null;
};