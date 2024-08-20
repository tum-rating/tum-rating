import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from './user';

@Schema({
    autoCreate: true, 
    autoIndex: true
})
export class UserBan {
    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
        unique: true
    })
    userId: MongooseSchema.Types.ObjectId;
    
    @Prop({ required: true, type: Date, default: Date.now })
    createdAt: Date;
}

export type UserBanDocument = UserBan & Document;

export const UserBanSchema = SchemaFactory.createForClass(UserBan);