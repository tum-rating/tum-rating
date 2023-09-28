import { Review } from "./types";
type Reviews = {
    reviews: Review[];
    nextPageNumber: number;
};
export declare function usePaginatedReviews(): import("@tanstack/react-query").UseInfiniteQueryResult<Reviews, unknown>;
export {};
