import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User, UserDocument } from 'src/database/documents/user';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> {
    constructor(
        @InjectModel(User.name)
        private readonly _userModel: Model<UserDocument>,
    ) {
        super(_userModel);
    }

    public getAllAndOmit(): Promise<Omit<WithId<User>, 'passwordHash' | 'passwordSalt' | 'emailDotSuffix'>[]> {
        return this._userModel.find().select(['-__v', '-passwordHash', '-passwordSalt', '-emailDotSuffix']);
    }

    public getByEmail(email: string) {
        return this._userModel.findOne({ email }).exec();
    }
    
    public getByEmailUsernameDotSuffix(emailDotSuffix: string) {
        return this._userModel.find({ emailDotSuffix });
    }

    public activateEmail(id: string) {
        return this._userModel.findByIdAndUpdate(id, {
            isEmailActivated: true,
        });
    }

    public updatePassword(id: string, newPasswordHash: string, newPasswordSalt: string) {
        return this._userModel.findByIdAndUpdate(id, {
            passwordHash: newPasswordHash,
            passwordSalt: newPasswordSalt,
            isEmailActivated: true,
        });
    }
}
