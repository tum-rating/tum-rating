import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UserBan, UserBanDocument } from 'src/database/documents/userBan';
import { BaseRepository } from './base.repository';

export class UserBanRepository extends BaseRepository<UserBan> {
    constructor(
        @InjectModel(UserBan.name)
        private readonly _userModel: Model<UserBanDocument>,
    ) {
        super(_userModel);
    }

    findByUserId(userId: MongooseSchema.Types.ObjectId | string) {
        return this._userModel.findOne({ userId }).exec();
    }

    deleteByUserId(userId: MongooseSchema.Types.ObjectId | string) {
        return this._userModel.deleteOne({ userId });
    }
}
