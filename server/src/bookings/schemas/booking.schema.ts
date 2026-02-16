import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Booking extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
    serviceId: string;

    @Prop({ required: true })
    date: string;

    @Prop({ required: true })
    time: string;

    @Prop({ default: 'pending' })
    status: string;

    @Prop({ required: true })
    customerName: string;

    @Prop({ required: true })
    customerPhone: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
