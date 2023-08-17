import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Professor } from './professor';

@Schema()
export class Course {
  @Prop({ required: true, unique: true, message: 'Name must be unique' })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Professor.name })
  professor: MongooseSchema.Types.ObjectId;
}

export type CourseDocument = Course & Document;

export const CourseSchema = SchemaFactory.createForClass(Course);
