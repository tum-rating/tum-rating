import {createCourseMockRequest} from "@tum-rating/backend/test/utils/api-client/course";
import {connectMongo, signInAdminRequestMock} from "@tum-rating/backend/test/utils";
import mongoose from "mongoose";

(async () => {
    await connectMongo();
    const signInAdminResponse = await signInAdminRequestMock();
    await createCourseMockRequest(signInAdminResponse.token, {
        name: 'advanced',
    });
    await mongoose.disconnect();
})();



