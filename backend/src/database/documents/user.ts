import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
    user = 0,
    admin,
}

export enum AuthType {
    local = 'local',
    oAuth = 'oAuth',
    both = 'both',
}

@Schema({
    autoCreate: true, 
    autoIndex: true
})
export class User {
    @Prop({ required: true, unique: true, message: 'username must be unique' })
    username: string;

    @Prop({ required: true, unique: true, message: 'email must be unique' })
    email: string;

    // for multiaccounts check
    @Prop({ required: false})
    emailDotSuffix?: string;

    @Prop()
    passwordHash: string;

    @Prop()
    passwordSalt: string;

    @Prop({ required: true, default: false })
    isEmailActivated: boolean;

    @Prop({ required: true, default: false })
    isBanned: boolean;

    @Prop({ required: true, enum: UserRole, default: UserRole.user })
    role: UserRole;

    @Prop({ required: true, enum: AuthType, default: AuthType.local })
    authType: AuthType;

    @Prop()
    oAuthId?: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({emailDotSuffix: 1}, {sparse: true});
UserSchema.set('toJSON', {virtuals: true});
