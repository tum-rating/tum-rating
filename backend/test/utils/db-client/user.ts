import mongoose from 'mongoose';

import { UserRole, UserSchema } from '@tum-rating/backend/src/database/documents/user';

const UserModel = mongoose.model('users', UserSchema);

export const activateUserEmail = async (email: string) => {
    const res = await UserModel.updateOne({ email }, { $set: { isEmailActivated: true } }).exec();
};

export const changeUserRole = async (id: string, role: UserRole) => {
    const res = await UserModel.updateOne({ _id: id }, { $set: { role } }).exec();
};

export const changeUserRoleByEmail = async (email: string, role: UserRole) => {
    const res = await UserModel.updateOne({ email }, { $set: { role } }).exec();
};

export const setUserBan = async (email: string, isBanned: boolean) => {
    await UserModel.updateOne({ email }, { $set: { isBanned } }).exec();
}