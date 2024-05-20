import { http, HttpResponse } from 'msw';

import {courseDetailsWithLoggedUserReview, courses, user} from './dataGenerators.ts';

import { endpoints } from '@/api';

export const handlers = [
    // User
    http.get(endpoints.user, async () => {
        return HttpResponse.json(user);
    }),
    // Course details
    http.get(endpoints.getSpecificCourse(':id'), async () => {
        return HttpResponse.json(courseDetailsWithLoggedUserReview);
    }),
    // Courses list (without pagination)
    http.get(endpoints.getAllCourses, async () => {
        return HttpResponse.json(courses);
    }),
    // Add user review
    http.post(endpoints.postSpecificReview(':courseId', ':userId'), async () => {
        return HttpResponse.json();
    }),
    // Update user review
    http.patch(endpoints.postSpecificReview(':courseId', ':userId'), async () => {
        return HttpResponse.json();
    }),

];
