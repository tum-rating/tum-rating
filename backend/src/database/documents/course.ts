import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Review } from './review';

@Schema()
export class Course {
    @Prop({ required: true, type: String })
    professor: string;

    @Prop({ type: [String] })
    otherLecturers: string[];

    @Prop({ required: true, type: String })
    name: string;

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
        type: [{ type: MongooseSchema.Types.ObjectId, ref: Review.name }],
    })
    reviews: string[];
}

export type CourseWithPopulatedReviews = Omit<Course, 'reviews'> & { reviews: Review[] };

export type CourseDocument = Course & Document;

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ name: 'text', professor: 'text' });
CourseSchema.index({ name: 1 });
CourseSchema.index({ name: 1, professor: 1 }, { unique: true });
