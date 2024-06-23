import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo } from '@tum-rating/backend/test/utils';
import { signInRequestMock, signInAdminRequestMock, banUser, unbanUser, userUrl } from '@tum-rating/backend/test/utils';
import { createCourseMockRequest, addReviewMockRequest, getCourseById } from '@tum-rating/backend/test/utils/api-client/course';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('User ban', () => {

    describe('ban', () => {
        it('should ban existings user', async () => {
            const user = await signInRequestMock();
            const admin = await signInAdminRequestMock();
            
            await supertest(userUrl + '/' + user.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);
        });

        it('ban should return 403 if called without admin token', async () => {
            const user = await signInRequestMock();
    
            await supertest(userUrl + '/' + user.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + user.token)
                .expect(403);
        });

        it('ban should return 401 if called without token', async () => {
            const user = await signInRequestMock();
    
            await supertest(userUrl + '/' + user.user.id + '/ban')
                .post('/')
                .expect(401);
        });

        it('should fail with 400 for non invalid  user id', async () => {
            const admin = await signInAdminRequestMock();
            await supertest(userUrl + '/' + 'non-exising-id' + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(400);
        });
        
        it('should fail with 404 for non invalid  user id', async () => {
            const admin = await signInAdminRequestMock();
            await supertest(userUrl + '/' + '000000000000000000000000' + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(404);
        });

        it('should succeed if banning the same user twice', async () => {
            const user = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            await supertest(userUrl + '/' + user.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);

            await supertest(userUrl + '/' + user.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);
        });

        it('should throw 403 for ban user requesting resources', async () => {
            const user = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            await banUser(admin.token, user.user.id);

            await supertest(userUrl + '/me')
                .get('/')
                .set('Authorization', 'Bearer ' + user.token)
                .expect(403);
        });

        it('should make reviews of banned user hidden with single review', async () => {
            const user = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            const createdCourse = await createCourseMockRequest(admin.token);
            const review = await addReviewMockRequest(user.token, createdCourse.id, user.user.id);

            const reviewFromApi = await getCourseById(createdCourse.id)

            expect(reviewFromApi.reviews.length).toBe(1);
            expect(reviewFromApi.reviews[0]['_id']).toBe(review.id);
            expect(reviewFromApi.reviews[0].isHidden).toBe(undefined);

            await supertest(userUrl + '/' + user.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);

            const reviewFromApiAfterBan = await getCourseById(createdCourse.id);

            expect(reviewFromApiAfterBan.reviews.length).toBe(0);
        });

        it('should make reviews of banned user hidden with multiple different users reviews review', async () => {
            const user1 = await signInRequestMock();
            const user2 = await signInRequestMock();
            const user3 = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            const createdCourse = await createCourseMockRequest(admin.token);
            
            const user_1_review = await addReviewMockRequest(user1.token, createdCourse.id, user1.user.id);
            const user_2_review = await addReviewMockRequest(user2.token, createdCourse.id, user2.user.id);
            const user_3_review = await addReviewMockRequest(user3.token, createdCourse.id, user3.user.id);

            const courseFromApi = await getCourseById(createdCourse.id)

            expect(courseFromApi.reviews.length).toBe(3);

            let foundReview = courseFromApi.reviews.find(review => review['_id'] === user_1_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi.reviews.find(review => review['_id'] === user_2_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi.reviews.find(review => review['_id'] === user_3_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);

            await supertest(userUrl + '/' + user1.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);

            const courseFromApiAfterBan = await getCourseById(createdCourse.id);

            expect(courseFromApiAfterBan.reviews.length).toBe(2);

            foundReview = courseFromApiAfterBan.reviews.find(review => review['_id'] === user_1_review.id);
            expect(foundReview).toBe(undefined);
            foundReview = courseFromApiAfterBan.reviews.find(review => review['_id'] === user_2_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApiAfterBan.reviews.find(review => review['_id'] === user_3_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
        });

        it('should make reviews of banned user hidden for all courses reviewd by this user', async () => {
            const user1 = await signInRequestMock();
            const user2 = await signInRequestMock();
            const user3 = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            const createdCourse1 = await createCourseMockRequest(admin.token);

            const user_1_course_1_review = await addReviewMockRequest(user1.token, createdCourse1.id, user1.user.id);
            const user_2_course_1_review = await addReviewMockRequest(user2.token, createdCourse1.id, user2.user.id);
            const user_3_course_1_review = await addReviewMockRequest(user3.token, createdCourse1.id, user3.user.id);

            const createdCourse2 = await createCourseMockRequest(admin.token);

            const user_1_course_2_review = await addReviewMockRequest(user1.token, createdCourse2.id, user1.user.id);
            const user_2_course_2_review = await addReviewMockRequest(user2.token, createdCourse2.id, user2.user.id);
            const user_3_course_2_review = await addReviewMockRequest(user3.token, createdCourse2.id, user3.user.id);

            const createdCourse3 = await createCourseMockRequest(admin.token);

            const user_1_course_3_review = await addReviewMockRequest(user1.token, createdCourse3.id, user1.user.id);
            const user_2_course_3_review = await addReviewMockRequest(user2.token, createdCourse3.id, user2.user.id);

            const courseFromApi = await getCourseById(createdCourse1.id)

            expect(courseFromApi.reviews.length).toBe(3);

            let foundReview = courseFromApi.reviews.find(review => review['_id'] === user_1_course_1_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi.reviews.find(review => review['_id'] === user_2_course_1_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi.reviews.find(review => review['_id'] === user_3_course_1_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);

            const courseFromApi2 = await getCourseById(createdCourse2.id)

            expect(courseFromApi2.reviews.length).toBe(3);

            foundReview = courseFromApi2.reviews.find(review => review['_id'] === user_1_course_2_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi2.reviews.find(review => review['_id'] === user_2_course_2_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi2.reviews.find(review => review['_id'] === user_3_course_2_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);

            const courseFromApi3 = await getCourseById(createdCourse3.id)

            expect(courseFromApi3.reviews.length).toBe(2);

            foundReview = courseFromApi3.reviews.find(review => review['_id'] === user_1_course_3_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi3.reviews.find(review => review['_id'] === user_2_course_3_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);


            await supertest(userUrl + '/' + user1.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);

            const courseFromApi1AfterBan = await getCourseById(createdCourse1.id);

            expect(courseFromApi1AfterBan.reviews.length).toBe(2);

            foundReview = courseFromApi1AfterBan.reviews.find(review => review['_id'] === user_1_course_1_review.id);
            expect(foundReview).toBe(undefined);
            foundReview = courseFromApi1AfterBan.reviews.find(review => review['_id'] === user_2_course_1_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi1AfterBan.reviews.find(review => review['_id'] === user_2_course_1_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);

            const courseFromApi2AfterBan = await getCourseById(createdCourse2.id);

            expect(courseFromApi2AfterBan.reviews.length).toBe(2);

            foundReview = courseFromApi2AfterBan.reviews.find(review => review['_id'] === user_1_course_2_review.id);
            expect(foundReview).toBe(undefined);
            foundReview = courseFromApi2AfterBan.reviews.find(review => review['_id'] === user_2_course_2_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
            foundReview = courseFromApi2AfterBan.reviews.find(review => review['_id'] === user_2_course_2_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);

            const courseFromApi3AfterBan = await getCourseById(createdCourse3.id);

            expect(courseFromApi3AfterBan.reviews.length).toBe(1);

            foundReview = courseFromApi3AfterBan.reviews.find(review => review['_id'] === user_1_course_3_review.id);
            expect(foundReview).toBe(undefined);
            foundReview = courseFromApi3AfterBan.reviews.find(review => review['_id'] === user_2_course_3_review.id);
            expect(foundReview).toBeDefined();
            expect(foundReview.isHidden).toBe(undefined);
        }, 10000);


        it('should make reviews of banned user hidden with proper single course stats alignment', async () => {
            const user1 = await signInRequestMock();
            const user2 = await signInRequestMock();
            const user3 = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            const createdCourse = await createCourseMockRequest(admin.token);
            
            const user_1_review = await addReviewMockRequest(user1.token, createdCourse.id, user1.user.id);
            const user_2_review = await addReviewMockRequest(user2.token, createdCourse.id, user2.user.id);
            const user_3_review = await addReviewMockRequest(user3.token, createdCourse.id, user3.user.id);

            let courseHowInteresing = (user_1_review.howInterestingRating + user_2_review.howInterestingRating + user_3_review.howInterestingRating) / 3;
            courseHowInteresing = parseFloat(courseHowInteresing.toFixed(2));
            let courseHowEasy = (user_1_review.howEasyRating + user_2_review.howEasyRating + user_3_review.howEasyRating) / 3;
            courseHowEasy = parseFloat(courseHowEasy.toFixed(2));

            const courseFromApi = await getCourseById(createdCourse.id)

            expect(courseFromApi.reviews.length).toBe(3);
            expect(courseFromApi.howInterestingRatingAverage).toBe(courseHowInteresing);
            expect(courseFromApi.howEasyRatingAverage).toBe(courseHowEasy);

            await supertest(userUrl + '/' + user1.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);

            const reviewFromApiAfterBan = await getCourseById(createdCourse.id);

            let courseHowInteresingAfterBan = (user_2_review.howInterestingRating + user_3_review.howInterestingRating) / 2;
            courseHowInteresingAfterBan = parseFloat(courseHowInteresingAfterBan.toFixed(2));
            let courseHowEasyAfterBan = (user_2_review.howEasyRating + user_3_review.howEasyRating) / 2;
            courseHowEasyAfterBan = parseFloat(courseHowEasyAfterBan.toFixed(2));

            expect(reviewFromApiAfterBan.reviews.length).toBe(2);
            expect(reviewFromApiAfterBan.howInterestingRatingAverage).toBe(courseHowInteresingAfterBan);
            expect(reviewFromApiAfterBan.howEasyRatingAverage).toBe(courseHowEasyAfterBan);
        });

        it('should make reviews of banned user hidden for all courses with proper stats alignment', async () => {
            const user1 = await signInRequestMock();
            const user2 = await signInRequestMock();
            const user3 = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            const createdCourse1 = await createCourseMockRequest(admin.token);

            const user_1_course_1_review = await addReviewMockRequest(user1.token, createdCourse1.id, user1.user.id);
            const user_2_course_1_review = await addReviewMockRequest(user2.token, createdCourse1.id, user2.user.id);
            const user_3_course_1_review = await addReviewMockRequest(user3.token, createdCourse1.id, user3.user.id);

            let course1HowInteresing = (user_1_course_1_review.howInterestingRating + user_2_course_1_review.howInterestingRating + user_3_course_1_review.howInterestingRating) / 3;
            course1HowInteresing = parseFloat(course1HowInteresing.toFixed(2));
            let course1HowEasy = (user_1_course_1_review.howEasyRating + user_2_course_1_review.howEasyRating + user_3_course_1_review.howEasyRating) / 3;
            course1HowEasy = parseFloat(course1HowEasy.toFixed(2));

            const createdCourse2 = await createCourseMockRequest(admin.token);

            const user_1_course_2_review = await addReviewMockRequest(user1.token, createdCourse2.id, user1.user.id);
            const user_2_course_2_review = await addReviewMockRequest(user2.token, createdCourse2.id, user2.user.id);
            const user_3_course_2_review = await addReviewMockRequest(user3.token, createdCourse2.id, user3.user.id);

            let course2HowInteresing = (user_1_course_2_review.howInterestingRating + user_2_course_2_review.howInterestingRating + user_3_course_2_review.howInterestingRating) / 3;
            course2HowInteresing = parseFloat(course2HowInteresing.toFixed(2));
            let course2HowEasy = (user_1_course_2_review.howEasyRating + user_2_course_2_review.howEasyRating + user_3_course_2_review.howEasyRating) / 3;
            course2HowEasy = parseFloat(course2HowEasy.toFixed(2));

            const createdCourse3 = await createCourseMockRequest(admin.token);

            const user_1_course_3_review = await addReviewMockRequest(user1.token, createdCourse3.id, user1.user.id);
            const user_2_course_3_review = await addReviewMockRequest(user2.token, createdCourse3.id, user2.user.id);

            let course3HowInteresing = (user_1_course_3_review.howInterestingRating + user_2_course_3_review.howInterestingRating) / 2;
            course3HowInteresing = parseFloat(course3HowInteresing.toFixed(2));
            let course3HowEasy = (user_1_course_3_review.howEasyRating + user_2_course_3_review.howEasyRating) / 2;
            course3HowEasy = parseFloat(course3HowEasy.toFixed(2));

            const courseFromApi = await getCourseById(createdCourse1.id);

            expect(courseFromApi.reviews.length).toBe(3);
            expect(courseFromApi.howInterestingRatingAverage).toBe(course1HowInteresing);
            expect(courseFromApi.howEasyRatingAverage).toBe(course1HowEasy);

            const courseFromApi2 = await getCourseById(createdCourse2.id)

            expect(courseFromApi2.reviews.length).toBe(3);
            expect(courseFromApi2.howInterestingRatingAverage).toBe(course2HowInteresing);
            expect(courseFromApi2.howEasyRatingAverage).toBe(course2HowEasy);

            const courseFromApi3 = await getCourseById(createdCourse3.id)

            expect(courseFromApi3.reviews.length).toBe(2);
            expect(courseFromApi3.howInterestingRatingAverage).toBe(course3HowInteresing);
            expect(courseFromApi3.howEasyRatingAverage).toBe(course3HowEasy);

            await supertest(userUrl + '/' + user1.user.id + '/ban')
                .post('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);

            const courseFromApi1AfterBan = await getCourseById(createdCourse1.id);

            let course1HowInteresingAfterBan = (user_2_course_1_review.howInterestingRating + user_3_course_1_review.howInterestingRating) / 2;
            course1HowInteresingAfterBan = parseFloat(course1HowInteresingAfterBan.toFixed(2));
            let course1HowEasyAfterBan = (user_2_course_1_review.howEasyRating + user_3_course_1_review.howEasyRating) / 2;
            course1HowEasyAfterBan = parseFloat(course1HowEasyAfterBan.toFixed(2));

            expect(courseFromApi1AfterBan.reviews.length).toBe(2);
            expect(courseFromApi1AfterBan.howInterestingRatingAverage).toBe(course1HowInteresingAfterBan);
            expect(courseFromApi1AfterBan.howEasyRatingAverage).toBe(course1HowEasyAfterBan);

            const courseFromApi2AfterBan = await getCourseById(createdCourse2.id);

            let course2HowInteresingAfterBan = (user_2_course_2_review.howInterestingRating + user_3_course_2_review.howInterestingRating) / 2;
            course2HowInteresingAfterBan = parseFloat(course2HowInteresingAfterBan.toFixed(2));
            let course2HowEasyAfterBan = (user_2_course_2_review.howEasyRating + user_3_course_2_review.howEasyRating) / 2;
            course2HowEasyAfterBan = parseFloat(course2HowEasyAfterBan.toFixed(2));

            expect(courseFromApi2AfterBan.reviews.length).toBe(2);
            expect(courseFromApi2AfterBan.howInterestingRatingAverage).toBe(course2HowInteresingAfterBan);
            expect(courseFromApi2AfterBan.howEasyRatingAverage).toBe(course2HowEasyAfterBan);

            const courseFromApi3AfterBan = await getCourseById(createdCourse3.id);

            expect(courseFromApi3AfterBan.reviews.length).toBe(1);
            expect(courseFromApi3AfterBan.howInterestingRatingAverage).toBe(user_2_course_3_review.howInterestingRating);
            expect(courseFromApi3AfterBan.howEasyRatingAverage).toBe(user_2_course_3_review.howEasyRating);
        }, 10000);
    });

    describe('unban', () => {
        it('should unban existings user', async () => {
            const user = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            await banUser(admin.token, user.user.id);

            await supertest(userUrl + '/' + user.user.id + '/ban')
                .delete('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);
        });

        it('should return 401 if called without token', async () => {
            const user = await signInRequestMock();
    
            await supertest(userUrl + '/' + user.user.id + '/ban')
                .delete('/')
                .expect(401);
        });

        it('should return 403 if called without admin token', async () => {
            const user = await signInRequestMock();
    
            await supertest(userUrl + '/' + user.user.id + '/ban')
                .delete('/')
                .set('Authorization', 'Bearer ' + user.token)
                .expect(403);
        });

        it('should fail with 404 for non invalid  user id', async () => {
            const admin = await signInAdminRequestMock();
            await supertest(userUrl + '/' + '000000000000000000000000' + '/ban')
                .delete('/')
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(404);
        });

        it('should succeed after unban for user requesting resources', async () => {
            const user = await signInRequestMock();
            const admin = await signInAdminRequestMock();

            await banUser(admin.token, user.user.id);

            await supertest(userUrl + '/me')
                .get('/')
                .set('Authorization', 'Bearer ' + user.token)
                .expect(403);

            await unbanUser(admin.token, user.user.id);

            await supertest(userUrl + '/me')
                .get('/')
                .set('Authorization', 'Bearer ' + user.token)
                .expect(200);
        });

        it('should return 403 if admin wants to unban himself', async () => {
            const admin = await signInAdminRequestMock();
            const admin2 = await signInAdminRequestMock();

            await banUser(admin.token, admin2.user.id);

            await supertest(userUrl + '/' + admin2.user.id + '/ban')
                .delete('/')
                .set('Authorization', 'Bearer ' + admin2.token)
                .expect(403);
        });
    });
});
