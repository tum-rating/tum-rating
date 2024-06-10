import {faker} from "@faker-js/faker";

export const TEST_USER = {
    email: faker.internet.email({ provider: 'tum.de' }),
    username: faker.internet.userName(),
    password: faker.internet.password()
}