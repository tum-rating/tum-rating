import {useQuery} from '@tanstack/react-query';
import {endpoints} from '../api';
import {QUERY_KEY} from '../constants/queryKeys';
import {ResponseError} from "../utils/Errors/ResponseError";
import {User} from "../auth/useUser";
import * as userLocalStorage from "../auth/user.localstore";


async function getReviews(user: User | null | undefined): Promise<Review[] | null> {
    if (!user) return null;
    const response = await fetch(endpoints.reviews, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);

    return await response.json();
}

export interface Review {
    _id: string;
    professor: string;
    course: string;
    courseId: string;
    courseNumber: string;
    createdAt: string;
    updatedAt: string;
    howInterestingRatingAverage: number;
    howEasyRatingAverage: number;
    votesNumber: number;
}

interface ReviewsData {
    reviews: Review[],
    isLoading: boolean;
}

export function useReviews(): ReviewsData {
    const user = userLocalStorage.getUser();
    const {data: reviews, isLoading} = useQuery({
        queryKey: [QUERY_KEY.reviews],
        queryFn: async () => getReviews(user)
    });

    return {
        reviews: reviews?.reviews ?? [],
        isLoading
    };
}