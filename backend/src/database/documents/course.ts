import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Review } from './review';
import { ExamStats, ExamStatsSchema } from './examStats';

@Schema({
    autoCreate: true,
    autoIndex: true
})
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

    @Prop({ required: true, type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ required: true, type: Date, default: Date.now })
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

    @Prop({
        type: Map,
        of: {
            type: Map,
            of: ExamStatsSchema,
        },
    })
    examStats: Map<string, Map<string, ExamStats>>;
}

export type CourseWithPopulatedReviews = Omit<Course, 'reviews'> & { reviews: Review[] };
export type CourseWithoutReviews = Omit<Course, 'reviews'>;

export type CourseDocument = Course & Document;

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ name: 'text', professor: 'text' });
CourseSchema.index({ name: 1 });
CourseSchema.index({ name: 1, professor: 1 }, { unique: true });
CourseSchema.index({ votesNumber: -1 });
