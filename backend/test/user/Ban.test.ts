import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo } from '@tum-rating/backend/test/utils';
import { signInRequestMock, signInAdminRequestMock, banUser, unbanUser, userUrl } from '@tum-rating/backend/test/utils';

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
