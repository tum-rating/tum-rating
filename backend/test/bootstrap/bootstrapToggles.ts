import { signInAdminRequestMock } from '@tum-rating/backend/test/utils/api-client/user';
import { createToggleMockRequest } from '@tum-rating/backend/test/utils/api-client/toggle';
import { CreateToggleRequestDto } from '@tum-rating/backend/src/modules/toggle/dto/CreateToggleRequest.dto';
import { connectMongo } from '@tum-rating/backend/test/utils';

import mongoose from 'mongoose';

const toggles: CreateToggleRequestDto[] = [
    {
        name: 'enableOAuth',
        description: 'Enables OAuth Sign In Button',
        enabled: true,
    },
];

(async () => {
    console.log('Creating toggles...');

    await connectMongo();

    const signInResponse = await signInAdminRequestMock();

    for (const toggle of toggles) {
        try {
            const toggleResponse = await createToggleMockRequest(signInResponse.token, toggle);
        } catch (error) {
            if (error.response.status === 409) {
                console.log(`Toggle ${toggle.name} already exists`);
                continue;
            }

            throw error;
        }
    }

    console.log('Toggles created: ', toggles);
    await mongoose.disconnect();
})();