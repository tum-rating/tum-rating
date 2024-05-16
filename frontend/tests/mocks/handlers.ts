import { faker } from '@faker-js/faker';

import { PAGE_SIZE } from '@/constants';

const generateCourse = () => ({
    _id: faker.string.uuid(),
    professor: faker.person.fullName(),
    otherLecturers: [faker.person.fullName(), faker.person.fullName()],
    name: faker.lorem.sentence(),
    courseId: faker.number.int().toString(),
    courseNumber: faker.number.int().toString(),
    offeredInSemesters: [faker.date.future().getFullYear() + ' S'],
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    howInterestingRatingAverage: faker.number.int({ min: 0, max: 5 }),
});

const generateCourseDetails = () => ({
    courseId: faker.number.int().toString(),
    courseNumber: faker.number.int().toString(),
    createdAt: faker.date.past().toISOString(),
    howEasyRatingAverage: faker.number.int({ min: 0, max: 5 }),
    howInterestingRatingAverage: faker.number.int({ min: 0, max: 5 }),
    name: faker.lorem.sentence(),
    offeredInSemesters: [faker.date.future().getFullYear() + ' S'],
    otherLecturers: [faker.person.fullName(), faker.person.fullName()],
    professor: faker.person.fullName(),
    reviews: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => generateCourseReview()),
    updatedAt: faker.date.recent().toISOString(),
    votesNumber: faker.number.int({ min: 0, max: 100 }),
    _id: faker.string.uuid(),
    __v: faker.number.int(),
});

const generateCourseReview = () => ({
    _id: faker.string.uuid(),
    courseId: faker.string.uuid(),
    userId: faker.string.uuid(),
    userName: faker.internet.userName(),
    howInterestingRating: faker.number.int({ min: 0, max: 5 }),
    howEasyRating: faker.number.int({ min: 0, max: 5 }),
    comment: faker.lorem.sentence(),
    semester: faker.date.future().getFullYear() + ' S',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
});

const courses = Array.from({ length: PAGE_SIZE }, () => generateCourse());
const course = generateCourse();
const courseReview = generateCourseReview();
const courseDetails = generateCourseDetails();

const user = {
    username: faker.internet.userName(),
    email: faker.internet.email({
        provider: 'tum.de',
    }),
    id: faker.number.int(),
};

export { user, courses, course, courseReview,courseDetails };
