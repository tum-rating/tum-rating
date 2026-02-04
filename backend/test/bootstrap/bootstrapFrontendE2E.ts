import { createCourseMockRequest } from "@tum-rating/backend/test/utils/api-client/course";
import { connectMongo, signInAdminRequestMock } from "@tum-rating/backend/test/utils";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

(async () => {
    await connectMongo();
    const signInAdminResponse = await signInAdminRequestMock();


    for (let i = 0; i < 13; i++) {
        await createCourseMockRequest(signInAdminResponse.token, {
            name: 'advanced',
        });
    }
    await mongoose.disconnect();
})();



