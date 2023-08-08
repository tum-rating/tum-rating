import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Professor } from './professor';

@Schema()
export class Subject {
    @Prop({ required: true, unique: true, message: 'Name must be unique' })
    name: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Professor.name })
    professor: MongooseSchema.Types.ObjectId;
}

export type SubjectDocument = Subject & Document;

export const SubjectSchema = SchemaFactory.createForClass(Subject);