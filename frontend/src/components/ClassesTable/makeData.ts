import { faker } from '@faker-js/faker';

export type Course = {
  course: string;
  professor: string;
  howEasyRating: number;
  howInterestingRating: number;
};

export const makeData = (numberOfRows: number) =>
  [...Array(numberOfRows).fill(null)].map(() => ({
    course: faker.lorem.words(2),
    professor: `${faker.person.firstName()} ${faker.person.lastName()}`,
    howEasyRating: faker.number.float({ min: 0, max: 100 }).toFixed(1),
    howInterestingRating: faker.number.float({ min: 0, max: 100 }).toFixed(1),
  }));
