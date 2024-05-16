import { faker } from '@faker-js/faker';

import { PAGE_SIZE } from '@/constants';

const courses = Array.from({ length: PAGE_SIZE }, () => ({
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
}));

const user = {
    username: faker.internet.userName(),
    email: faker.internet.email({
        provider: 'tum.de',
    }),
    id: faker.number.int()
};

export { user, courses };
