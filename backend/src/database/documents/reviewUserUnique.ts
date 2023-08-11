import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { User } from './user';
import { Review } from './review';

@Schema()
export class ReviewUserUnique {
    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: Review.name })
    reviewId: MongooseSchema.Types.ObjectId;
}

export type ReviewUserUniqueDocument = ReviewUserUnique & Document;

export const ReviewUserUniqueSchema = SchemaFactory.createForClass(ReviewUserUnique);

ReviewUserUniqueSchema.index({userId: 1, reviewId: 1}, {unique: true});
