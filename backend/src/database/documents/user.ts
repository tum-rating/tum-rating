import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
    @Prop({ required: true, unique: true, message: 'username must be unique' })
    username: string;

    @Prop({ required: true, unique: true, message: 'Email must be unique' })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true })
    passwordSalt: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
