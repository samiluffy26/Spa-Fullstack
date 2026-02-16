import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Service extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    duration: number;

    @Prop({ required: true })
    category: string;

    @Prop()
    image: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
