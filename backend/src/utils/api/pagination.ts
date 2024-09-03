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
