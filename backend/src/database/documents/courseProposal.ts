import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from './user';

@Schema({
    autoCreate: true, 
    autoIndex: true
})
export class CourseProposal {
    @Prop({
        required: true,
        type: String,
    })
    url: string;

    @Prop({
        required: true,
        type: MongooseSchema.Types.ObjectId,
        ref: User.name,
    })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
        type: Date,
        default: Date.now,
    })
    createdAt: Date;
}

export type CourseProposalDocument = CourseProposal & Document;

export const CourseProposalSchema = SchemaFactory.createForClass(CourseProposal);
