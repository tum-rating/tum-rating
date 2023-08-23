import { faker } from '@faker-js/faker';

export const fakeNumberOfLenght = (length: number) => {
    return faker.number.int({min: 0, max: Math.pow(10, length) - 1}).toString().padStart(length, '0');
}