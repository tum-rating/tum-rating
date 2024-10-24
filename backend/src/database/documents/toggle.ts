import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    autoCreate: true, 
    autoIndex: true
})
export class Toggle {
    @Prop({ required: true, type: String, unique: true })
    name: string;

    @Prop({ required: false, type: String})
    description?: string;

    @Prop({ required: true, type: Boolean, default: false })
    enabled: boolean;
}

export type ToggleDocument = Toggle & Document;

export const ToggleSchema = SchemaFactory.createForClass(Toggle);
