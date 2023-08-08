import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Professor } from './professor';
import { Subject } from './subject';
import { User } from './user';

@Schema()
export class UserReview {
    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
    user: MongooseSchema.Types.ObjectId;

    @Prop({required: true, type: Number})
    howInterestingReview: Number;
    
    @Prop({required: true, type: Number})
    howHardReview: Number;

    @Prop({type: String})
    comment: String;
}

export const UserReviewSchema = SchemaFactory.createForClass(UserReview);

@Schema()
export class Review {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Professor.name })
    professor: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Subject.name })
    subject: MongooseSchema.Types.ObjectId;

    @Prop({type: Number, defafault: 0})
    howInterestingAverage: Number;

    @Prop({type: Number, defafault: 0})
    howInterestingReviewsNumber: Number
    
    @Prop({type: Number, defafault: 0})
    howHardAverage: Number;

    @Prop({type: Number, defafault: 0})
    howHardReviewsNumber: Number;

    @Prop({type: [UserReviewSchema], default: []})
    reviews: UserReview[];
}

export type ReviewDocument = Review & Document;

export const ReviewSchema = SchemaFactory.createForClass(Review);