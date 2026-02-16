import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private settingsService: SettingsService
  ) { }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const settings = await this.settingsService.getSettings();
    const bookingDate = new Date(createBookingDto.date);
    const dayOfWeek = bookingDate.getDay(); // 0=Sun, 1=Mon...
    const dateString = createBookingDto.date.split('T')[0];

    // 1. Check if day is open in weekly schedule
    const daySchedule = settings.weeklySchedule.find(d => d.day === dayOfWeek);
    if (!daySchedule || !daySchedule.isOpen) {
      throw new BadRequestException('El negocio está cerrado este día de la semana.');
    }

    // 2. Check for exceptions (holidays, closed dates)
    const exception = settings.exceptions.find(ex => ex.date === dateString && ex.type === 'closed');
    if (exception) {
      throw new BadRequestException(`El negocio está cerrado en esta fecha: ${exception.reason || 'Feriado/Cerrado'}`);
    }

    // 3. Time validation (simple check against open/close time)
    // Assuming createBookingDto.time is "HH:mm" and daySchedule.openTime/closeTime are "HH:mm"
    if (createBookingDto.time < daySchedule.openTime || createBookingDto.time >= daySchedule.closeTime) {
      throw new BadRequestException(`La hora seleccionada está fuera del horario de atención (${daySchedule.openTime} - ${daySchedule.closeTime}).`);
    }

    // 4. Check max daily bookings
    // Using string comparison since schema defines date as string
    const startOfDay = dateString + 'T00:00:00.000Z';
    const endOfDay = dateString + 'T23:59:59.999Z';

    const dailyBookingsCount = await this.bookingModel.countDocuments({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    } as any);

    if (dailyBookingsCount >= settings.maxDailyBookings) {
      throw new BadRequestException('Lo sentimos, hemos alcanzado el límite de reservas para este día.');
    }

    const createdBooking = new this.bookingModel(createBookingDto);
    return createdBooking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().populate('userId').populate('serviceId').exec();
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.bookingModel.find({ userId }).populate('serviceId').exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).populate('serviceId').exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();
    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return updatedBooking;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }
}
