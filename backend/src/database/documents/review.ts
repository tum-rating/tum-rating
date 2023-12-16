import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { ReviewUser } from './reviewUser';

@Schema()
export class Review {
    @Prop({ required: true, type: String })
    professor: string;

    @Prop({ type: [String] })
    otherLecturers: string[];

    @Prop({ required: true, type: String })
    course: string;

    @Prop({ required: true, type: String })
    courseId: string;

    @Prop({ required: true, type: String })
    courseNumber: string;

    @Prop({ required: true, type: [String] })
    offeredInSemesters: string[];

    @Prop({ required: true, type: Date, default: new Date() })
    createdAt: Date;

    @Prop({ required: true, type: Date, default: new Date() })
    updatedAt: Date;

    @Prop({ type: Number, default: 0, min: 0, max: 100 })
    howInterestingRatingAverage: number;

    @Prop({ type: Number, default: 0, min: 0, max: 100 })
    howEasyRatingAverage: number;

    @Prop({ type: Number, default: 0 })
    votesNumber: number;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: ReviewUser.name }],
    })
    reviews: string[];
}

export type ReviewDocument = Review & Document;

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ course: 'text', professor: 'text' });
ReviewSchema.index({ course: 1 });
ReviewSchema.index({ course: 1, professor: 1 }, { unique: true });
