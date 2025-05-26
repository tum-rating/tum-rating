import mongoose from 'mongoose';

import { Course, CourseSchema } from '@tum-rating/backend/src/database/documents/course';
import { Review, ReviewSchema } from '@tum-rating/backend/src/database/documents/review';

export const mongooseConfig = {
    username: 'root-user',
    password: 'root-password',
    host: 'localhost',
    port: '27017',
    dbName: 'tum-rating',
    get connectionUrl() {
        return this.url || 'mongodb://' + this.username + ':' + this.password + '@' + this.host + ':' + this.port + '/?directConnection=true';
    },
};

export const connectMongo = (connectionUrl?: string, databaseName?: string) => {
    const configConnectionUrl = connectionUrl || mongooseConfig.connectionUrl;
    const configDatabaseName = databaseName || mongooseConfig.dbName;

    return mongoose.connect(configConnectionUrl, {
        dbName: configDatabaseName,
    });
};

// Course

const CourseModel = mongoose.model('courses', CourseSchema);

export const getCourse = async (courseId: string) => {
    return CourseModel.findById(courseId);
}

export const getCourseByName = async (name: string) => {
    return CourseModel.findOne({
        name
    })
}

export const createCourse = async (course: Pick<Course, 'professor' | 'otherLecturers' | 'name' | 'courseId' | 'courseNumber' | 'offeredInSemesters'>) => {
    const newCourse = new CourseModel(course);
    return newCourse.save();
}

export const updateCourse = async (courseId: string, course: Partial<Course>) => {
    return CourseModel.findByIdAndUpdate(courseId, course, { new: true });
}

export const deleteCourse = async (courseId: string) => {
    return CourseModel.findByIdAndDelete(courseId);
}

// Review

const ReviewModel = mongoose.model('reviews', ReviewSchema);

export const getReviewsForCourse = async (courseId: string) => {
    return ReviewModel.find({ courseId });
}

export const updateReview = async (reviewId: string, review: Partial<Review>) => {
    return ReviewModel.findByIdAndUpdate(reviewId, review, { new: true });
}