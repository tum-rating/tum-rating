import mongoose from 'mongoose';

import { UserSchema } from '@tum-rating/backend/src/database/documents/user';

const UserModel = mongoose.model('users', UserSchema);

export const activateUserEmail = async (email: string) => {
    const res = await UserModel.updateOne({email}, {$set: {isEmailActivated: true}}).exec();
}