import {
    signInRequestMock,
    signInAdminRequestMock,
} from '@tum-rating/backend/test/utils/api-client/user';
import { connectMongo } from '@tum-rating/backend/test/utils';

import mongoose from 'mongoose';

(async () => {
    await connectMongo();

    const signInResponse = await signInRequestMock();

    console.log('User: ', signInResponse);

    const signInAdminResponse = await signInAdminRequestMock();

    console.log('Admin: ', signInAdminResponse);

    await mongoose.disconnect();
})();
