import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateBookingDto {
    @IsMongoId()
    @IsNotEmpty()
    serviceId: string;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    @IsNotEmpty()
    customerPhone: string;
}
