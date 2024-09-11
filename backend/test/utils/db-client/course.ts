import mongoose from 'mongoose';

import { Course, CourseSchema } from '@tum-rating/backend/src/database/documents/course';

const CourseModel = mongoose.model('courses', CourseSchema);

export const deleteCoursesWithName = async (title: string) => {
    return await CourseModel.deleteMany({ name: title });
};

export const updateCourse = async (courseId: string, course: Partial<Course>) => {
    return await CourseModel.findByIdAndUpdate(courseId, course, { new: true });
};

export const dropAllCourses = async () => {
    await CourseModel.deleteMany({});
}