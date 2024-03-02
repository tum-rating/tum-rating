import mongoose from 'mongoose';

import { ReviewSchema } from '@tum-rating/backend/src/database/documents/review';

const ReviewModel = mongoose.model('reviews', ReviewSchema);

export const deleteReviewsWithCourseTitle = async (title: string) => {
    return await ReviewModel.deleteMany({ course: title });
};
