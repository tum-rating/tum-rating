import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo } from '@tum-rating/backend/test/utils';
import { signUpRequestMock } from '@tum-rating/backend/test/utils';
import { getDupicatesListFromMail } from '@tum-rating/backend/test/utils/api-client/mailer';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('User SignUp With Duplicated Username Sufixes', () => {
    it('should send an email if signup with duplicated email username suffixes', async () => {

        const surname = faker.person.lastName();
        const emailsDotDuplicated: string[] = [
            `${faker.person.firstName()}.${surname}@tum.de`,
            `${faker.person.firstName()}.${surname}@tum.de`
        ];

        for await(const email of emailsDotDuplicated) {
            const results = await signUpRequestMock({email});
        }

        await new Promise((r) => setTimeout(r, 2000));

        const mails = await getDupicatesListFromMail(surname);

        expect(mails.length > 0).toBe(true);
        expect(mails[0].html.includes(emailsDotDuplicated[0])).toBe(true);
        expect(mails[0].html.includes(emailsDotDuplicated[1])).toBe(true);
    }, 10000);
});
