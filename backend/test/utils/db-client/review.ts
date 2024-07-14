import mongoose from 'mongoose';

import { Review, ReviewSchema } from '@tum-rating/backend/src/database/documents/review';

const ReviewModel = mongoose.model('reviews', ReviewSchema);

export const updateReview = async (reviewId: string, review: Partial<Review>) => {
    return await ReviewModel.updateOne({ _id: reviewId }, review, { new: true }).exec();
}

export const getReviewById = async (reviewId: string) => {
    return await ReviewModel.findById(reviewId).exec();
}