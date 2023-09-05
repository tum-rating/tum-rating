import { signInRequestMock } from '@tum-rating/backend/test/utils/api-client/user';
import { connectMongo } from '@tum-rating/backend/test/utils';

import mongoose from 'mongoose';

(async () => {
    await connectMongo();

    const signInResponse = await signInRequestMock();

    console.log('User: ', signInResponse);

    await mongoose.disconnect();
})();

