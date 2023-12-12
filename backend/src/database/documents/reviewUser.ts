import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from './user';

@Schema()
export class ReviewUser {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'review'})
    reviewId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: Number, min: 0, max: 5 })
    howInterestingRating: number;

    @Prop({ required: true, type: Number, min: 0, max: 5 })
    howEasyRating: number;

    @Prop({ required: true, type: String })
    userName: string;

    @Prop({ type: String })
    comment?: string;

    @Prop({type: String, required: true})
    semester: string;

    @Prop({ required: true, type: Date, default: new Date() })
    createdAt: Date;

    @Prop({ required: true, type: Date, default: new Date() })
    updatedAt: Date;
}

export type ReviewUserDocument = ReviewUser & Document;

export const ReviewUserSchema = SchemaFactory.createForClass(ReviewUser);

ReviewUserSchema.index({ reviewId: 1, userId: 1 }, { unique: true });
