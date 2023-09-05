import {useQuery} from '@tanstack/react-query';
import {endpoints} from '../api';
import {ResponseError} from "../utils/Errors/ResponseError";
import {User} from "../auth/useUser";
import * as userLocalStorage from "../auth/user.localstore";

async function getDetailReview(user: User | null | undefined,_id: string): Promise<DetailReview | null> {
    if (!user) return null;
    const endpoint = endpoints.reviews + '/' + _id
    const response = await fetch(endpoint);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    return await response.json();
}

export interface DetailReview {
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
    reviews: any[];
    __v: number;
}


export function useDetailReview(_id:string): { review:DetailReview,status: any}  {
    const user = userLocalStorage.getUser();
    const { data:review, status }  = useQuery({
        queryKey: ['detailReview', _id],
        queryFn: async () => getDetailReview(user,_id)
    });

    return {review,status};
}