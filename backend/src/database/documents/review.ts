import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from './user';

@Schema({
    autoCreate: true, 
    autoIndex: true
})
export class Review {
    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
    })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: 'course',
    })
    courseId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: Boolean, default: false })
    isHidden: boolean;

    @Prop({ required: true, type: Number, min: 0, max: 5 })
    howInterestingRating: number;

    @Prop({ required: true, type: Number, min: 0, max: 5 })
    howEasyRating: number;

    @Prop({ required: true, type: String })
    userName: string;

    @Prop({ type: String })
    comment?: string;

    @Prop({ type: String, required: true })
    semester: string;

    @Prop({ required: true, type: Date, default: Date.now() })
    createdAt: Date;

    @Prop({ required: true, type: Date, default: Date.now() })
    updatedAt: Date;
}

export type ReviewDocument = Review & Document;

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });
ReviewSchema.index({ courseId: 1, isHidden: 1 });
ReviewSchema.index({ userId: 1 });
