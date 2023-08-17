import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { type } from 'os';

@Schema()
export class Professor {
  @Prop({ required: true, unique: true, message: 'Name must be unique' })
  name: string;
}

export type ProfessorDocument = Professor & Document;

export const ProfessorSchema = SchemaFactory.createForClass(Professor);
