import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { reviewUrl } from '@tum-rating/backend/test/utils/api-client/review';
import { createCourseReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { deleteReviewsWithCourseTitle } from '@tum-rating/backend/test/utils/db-client/review';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get Course Review', () => {
    it('should get course review', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInResponse.token);

        return supertest(reviewUrl)
            .get('/')
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length >= 1).toBe(true);
            });
    });
    it('should get course review by id', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInResponse.token);

        return supertest(reviewUrl)
            .get('/' + createdReview.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body._id).toEqual(createdReview.id);
                expect(response.body.courseId).toEqual(createdReview.courseId);
                expect(response.body.course).toEqual(createdReview.name);
                expect(response.body.professor).toEqual(createdReview.professor);
                expect(response.body.courseNumber).toEqual(createdReview.courseNumber);
                expect(response.body.reviews).toBeDefined();
            });
    });
    it('should search course by its title', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInResponse.token, {
            name: faker.string.uuid(),
        });

        return supertest(reviewUrl)
            .get('?search=' + createdReview.name)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length == 1).toBe(true);
                expect(response.body.reviews.find((review) => review._id === createdReview.id)).toBeDefined();
            });
    });

    it('should search course by its title part', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInResponse.token, {
            name: faker.string.uuid(),
        });

        return supertest(reviewUrl)
            .get('?search=' + createdReview.name)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length == 1).toBe(true);
                expect(response.body.reviews.find((review) => review._id === createdReview.id)).toBeDefined();
            });
    });

    it('should search course by professor', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInResponse.token, {
            professor: faker.string.uuid(),
        });

        return supertest(reviewUrl)
            .get('?search=' + createdReview.professor)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length == 1).toBe(true);
                expect(response.body.reviews.find((review) => review._id === createdReview.id)).toBeDefined();
            });
    });

    it('should search by parital course title', async () => {
        const commonTitlePart = faker.word.noun();

        const title1 = faker.word.words(4) + ' ' + commonTitlePart;
        const title2 = commonTitlePart + ' ' + faker.word.words(3);
        const title3s = faker.word.words(5).split(' ');
        title3s.splice(2, 0, commonTitlePart);
        const title3 = title3s.join(' ');

        await Promise.all([deleteReviewsWithCourseTitle(title1), deleteReviewsWithCourseTitle(title2), deleteReviewsWithCourseTitle(title3)]);

        const signInResponse = await signInAdminRequestMock();

        const createdReview1 = await createCourseReviewMockRequest(signInResponse.token, {
            name: title1,
        });

        const createdReview2 = await createCourseReviewMockRequest(signInResponse.token, {
            name: title2,
        });

        const createdReview3 = await createCourseReviewMockRequest(signInResponse.token, {
            name: title3,
        });

        return supertest(reviewUrl)
            .get('?search=' + commonTitlePart)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length === 3).toBe(true);
                expect(response.body.reviews.find((review) => review._id === createdReview1.id)).toBeDefined();
                expect(response.body.reviews.find((review) => review._id === createdReview2.id)).toBeDefined();
                expect(response.body.reviews.find((review) => review._id === createdReview3.id)).toBeDefined();
            });
    });

    it('should return paginated reviews', async () => {
        const commonTitlePart = faker.word.noun();
        const titles = Array(15)
            .fill('')
            .map(() => commonTitlePart + ' ' + faker.word.words(5));

        await Promise.all(titles.map((title) => deleteReviewsWithCourseTitle(title)));

        const signInResponse = await signInAdminRequestMock();

        const createdReviews = await Promise.all(
            titles.map((title) =>
                createCourseReviewMockRequest(signInResponse.token, {
                    name: title,
                }),
            ),
        );

        createdReviews.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

        const paginationResponse = await supertest(reviewUrl)
            .get(`?search=${commonTitlePart}&page-size=5`)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body).toHaveProperty('nextPageNumber');
                expect(response.body.reviews.length).toBe(5);
                for (let i = 0; i < 5; i++) {
                    expect(response.body.reviews.find((review) => review._id === createdReviews[i].id)).toBeDefined();
                }
            });

        const paginationResponse2 = await supertest(reviewUrl)
            .get(`?search=${commonTitlePart}&page-size=5&page-number=` + paginationResponse.body.nextPageNumber)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body).toHaveProperty('nextPageNumber');
                expect(response.body.reviews.length).toBe(5);
                for (let i = 5; i < 10; i++) {
                    expect(response.body.reviews.find((review) => review._id === createdReviews[i].id)).toBeDefined();
                }
            });

        return supertest(reviewUrl)
            .get(`?search=${commonTitlePart}&page-size=5&page-number=` + paginationResponse2.body.nextPageNumber)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body).toHaveProperty('nextPageNumber');
                expect(response.body.reviews.length).toBe(5);
                for (let i = 10; i < 15; i++) {
                    expect(response.body.reviews.find((review) => review._id === createdReviews[i].id)).toBeDefined();
                }
            });
    });
});
