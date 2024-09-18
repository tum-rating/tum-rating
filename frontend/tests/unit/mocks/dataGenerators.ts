import crypto from 'crypto';

import {faker} from '@faker-js/faker';

import {PAGE_SIZE} from '@/constants';

function withOverrides(generator: () => any) {
    return (overrides = {}) => {
        const data = generator();
        return {...data, ...overrides};
    };
}

const generateJwtToken = () => {
    const header = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'JWT'})).toString('base64');

    const payload = {
        tokenType: 0,
        userRole: 0,
        sub: '6544ad03d4181618a8537dba',
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');

    const secret = 'my-super-secret-key-1234567890';

    const signature = crypto
        .createHmac('sha256', secret)
        .update(header + '.' + payloadBase64)
        .digest('base64');

    return header + '.' + payloadBase64 + '.' + signature;
};

const generateCourse = withOverrides(() => ({
    id: faker.string.uuid(),
    professor: faker.person.fullName(),
    otherLecturers: [faker.person.fullName(), faker.person.fullName()],
    name: faker.lorem.sentence(),
    courseId: faker.number.int().toString(),
    courseNumber: faker.number.int().toString(),
    offeredInSemesters: [faker.date.future().getFullYear() + ' S'],
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    howInterestingRatingAverage: faker.number.int({min: 0, max: 5}),
}));

const generateCourseDetails = withOverrides(() => ({
    courseId: faker.number.int().toString(),
    courseNumber: faker.number.int().toString(),
    createdAt: faker.date.past().toISOString(),
    howEasyRatingAverage: faker.number.int({min: 0, max: 5}),
    howInterestingRatingAverage: faker.number.int({min: 0, max: 5}),
    name: faker.lorem.sentence(),
    offeredInSemesters: [faker.date.future().getFullYear() + ' S'],
    otherLecturers: [faker.person.fullName(), faker.person.fullName()],
    professor: faker.person.fullName(),
    reviews: Array.from({length: faker.number.int({min: 1, max: 10})}, () => generateCourseReview()),
    updatedAt: faker.date.recent().toISOString(),
    votesNumber: faker.number.int({min: 0, max: 100}),
    id: faker.string.uuid(),
    __v: faker.number.int(),
}));

const generateCourseReview = withOverrides(() => ({
    id: faker.string.uuid(),
    courseId: faker.string.uuid(),
    userId: faker.string.uuid(),
    userName: faker.internet.userName(),
    howInterestingRating: faker.number.int({min: 0, max: 5}),
    howEasyRating: faker.number.int({min: 0, max: 5}),
    comment: faker.lorem.sentence(),
    semester: faker.date.future().getFullYear() + ' S',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
}));

const user = {
    username: faker.internet.userName(),
    email: faker.internet.email({
        provider: 'mytum.de',
    }),
    id: faker.number.int(),
};

const courses = Array.from({length: PAGE_SIZE}, () => generateCourse());
const course = generateCourse();
const courseReview = generateCourseReview();
const courseDetails = generateCourseDetails();
const courseDetailsWithLoggedUserReview = generateCourseDetails({
    reviews: [
        generateCourseReview({
            userId: user.id,
            userName: user.username,
        }),
    ],
});

export {user, courses, course, courseReview, courseDetails, generateJwtToken, courseDetailsWithLoggedUserReview};
