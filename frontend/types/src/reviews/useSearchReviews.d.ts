import { DetailReview } from "./types";
export declare function getReviews(query: string): Promise<DetailReview | null>;
export declare function useSearchReviews(query: string): import("@tanstack/react-query").UseQueryResult<DetailReview | null, unknown>;
