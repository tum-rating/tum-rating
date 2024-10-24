import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import { CourseRepository } from 'src/database/repositories/course.repository';
import { Course } from 'src/database/documents/course';
import { NotFoundError, CourseReviewSemesterMismatch } from 'src/utils/errors/errors';
import { CreateReviewType, PatchReviewType, ReviewRepository } from 'src/database/repositories/review.repository';
import { CacheService } from 'src/utils/cache/cache.service';

@Injectable()
export class CourseService {
    constructor(
        private readonly _courseRepository: CourseRepository,
        private readonly _reviewRepository: ReviewRepository,
        private readonly _cacheService: CacheService,
        private readonly _configService: ConfigService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(CourseService.name);
    }

    public async createCourse(course: Partial<Course>) {
        return  this._courseRepository.create(course as Course);
    }

    public async getCoursesOverviewPaginated(pageNumber: number, pageSize: number, search?: string) {
        return this._courseRepository.getCoursesByQuery(pageNumber, pageSize, search);
    }

    public async getCourseById(id: string) {
        const course = await this._courseRepository.findOneById(id);

        return course;
    }

    public async getCourseByIdWihtPopulatedReviews(id: string) {
        const course = await this._courseRepository.findOneByIdWithPopulatedReviews(id);

        if (course === null) throw new NotFoundError(`course ${id} not found`);

        return course;
    }

    public async getReview(courseId: string, userId: string) {
        const review = await this._reviewRepository.getOneByCourseIdAndUserId(courseId, userId);

        if (review === null) throw new NotFoundError(`review ${courseId} user ${userId} not found`);

        return review;
    }

    public async getTrendingCourses(limit: number) {
        const cachedTrendingCourses = await this._cacheService.trendingCourses.get();

        if (cachedTrendingCourses) {
            this._logger.debug('Returning trending courses from cache');

            return cachedTrendingCourses.slice(0, limit);
        }

        const trendingCourses = await this._courseRepository.getCoursesWithMostReviews(100);

        await this._cacheService.trendingCourses.set(trendingCourses);

        return trendingCourses.slice(0, limit);
    }

    public async resetTrendingCoursesCache() {
        const trendingCourses = await this._courseRepository.getCoursesWithMostReviews(100);

        this._cacheService.trendingCourses.set(trendingCourses);

        return trendingCourses;
    }

    public async addReview(review: CreateReviewType) {
        const course = await this.getCourseById(review.courseId as unknown as string);

        if (!course.offeredInSemesters.includes(review.semester)) throw new CourseReviewSemesterMismatch(review.semester, course.offeredInSemesters);

        const createdReview = await this._reviewRepository.create(review);

        await this._courseRepository.addReview(course.id, createdReview.id);

        return createdReview;
    }

    public async deleteReview(userId: string, courseId: string) {
        return this._reviewRepository.deleteOneByUserIdAndCourseId(userId, courseId);
    }

    public async updateCourseStats(courseId: string): Promise<WithId<Course>> {
        const stats = await this._reviewRepository.getStatsByCourseId(courseId);

        const course = await this._courseRepository.updateCourseStats(courseId, stats) as unknown as WithId<Course>;

        if (course === null) throw new NotFoundError('course not found');

        return course;
    }

    public async updateCourse(id: string, course: Partial<Course>) {
        const upadatedCourse = await this._courseRepository.updateOneById(id, course);

        if (upadatedCourse === null) throw new NotFoundError('course not found');

        return upadatedCourse
    }

    public async patchReview(courseId: string, userId: string, patchUser: PatchReviewType) {
        const course = await this._courseRepository.findOneById(courseId);

        if (course === null) throw new NotFoundError('review not found');

        if (patchUser.semester && !course.offeredInSemesters.includes(patchUser.semester))
            throw new CourseReviewSemesterMismatch(patchUser.semester, course.offeredInSemesters);

        const updateResult = await this._reviewRepository.updateOneByUserIdAndCourseId(userId, courseId, patchUser);

        if (updateResult === null) throw new NotFoundError('review not found');

        return updateResult;
    }

    public async deleteCourse(id: string) {
        const deletedCourse = await this._courseRepository.deleteOneById(id);

        if (deletedCourse === null) throw new NotFoundError('course not found');

        return deletedCourse;
    }
}
