import mongoose from 'mongoose';

import { ReviewSchema } from 'src/database/documents/Review';

const ReviewModel = mongoose.model('reviews', ReviewSchema);

export const deleteReviewsWithCourseTitle = async (title: string) => {
    return await ReviewModel.deleteMany({ course: title });
};
