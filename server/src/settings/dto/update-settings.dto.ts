import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class DayScheduleDto {
    @IsNumber()
    @Min(0)
    @Max(6)
    day: number; // 0=Sunday, 1=Monday, etc.

    @IsBoolean()
    isOpen: boolean;

    @IsString()
    openTime: string; // "09:00"

    @IsString()
    closeTime: string; // "18:00"
}

export class ExceptionDto {
    @IsString()
    date: string; // ISO date YYYY-MM-DD

    @IsString()
    type: string; // 'closed', 'custom'

    @IsOptional()
    @IsString()
    reason?: string;
}

export class UpdateSettingsDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DayScheduleDto)
    weeklySchedule?: DayScheduleDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExceptionDto)
    exceptions?: ExceptionDto[];

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxDailyBookings?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxGuestsPerBooking?: number;
}
