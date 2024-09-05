export type PaginationOptions = {
    pageNumber: number;
    pageSize: number;
};

export class PaginatedResults<T> {
    constructor(
        public results: T[],
        public nextPageNumber: number | null,
    ) {}
};

export const getNextPageNumber = (results, pageNumber, pageSize) => {
    return results.length > 0 && results.length === pageSize ? pageNumber + 1 : null
}