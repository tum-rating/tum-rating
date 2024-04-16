import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from './user';

@Schema()
export class CourseProposal {
    @Prop({ required: true, type: String })
    professor: string;

    @Prop({ type: [String] })
    otherLecturers?: string[];

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    courseId: string;

    @Prop({ required: true, type: String })
    courseNumber: string;

    @Prop({ required: true, type: [String] })
    offeredInSemesters: string[];

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
    })
    userId: MongooseSchema.Types.ObjectId;
}

export type CourseProposalDocument = CourseProposal & Document;

export const CourseProposalSchema = SchemaFactory.createForClass(CourseProposal);
