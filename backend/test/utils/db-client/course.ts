import mongoose from 'mongoose';

import { CourseSchema } from '@tum-rating/backend/src/database/documents/course';

const CourseModel = mongoose.model('courses', CourseSchema);

export const deleteCoursesWithName = async (title: string) => {
    return await CourseModel.deleteMany({ name: title });
};
