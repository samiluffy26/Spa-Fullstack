import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../bookings/schemas/booking.schema';
import { User } from '../users/schemas/user.schema';
import { Service } from '../services/schemas/service.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<Booking>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Service.name) private serviceModel: Model<Service>,
    ) { }

    async getStats() {
        // 1. Cantidad de clientes (usuarios con rol 'client')
        const clientCount = await this.userModel.countDocuments({ role: 'client' });

        // 2. Cantidad de reservas (todas)
        const totalBookings = await this.bookingModel.countDocuments();

        // 3. Cantidad de servicios realizados (status 'completed' o similar)
        // Nota: Si no hay 'completed', contamos 'pending' por ahora o asumimos que todos son realizados una vez pasada la fecha
        const completedServices = await this.bookingModel.countDocuments({ status: 'completed' });

        // 4. Ingresos calculados por los precios de los servicios
        // Necesitamos cruzar las reservas con los precios de los servicios
        const bookings = await this.bookingModel.find({ status: 'completed' }).exec();

        // Obtener todos los servicios para tener los precios
        const services = await this.serviceModel.find().exec();
        const servicePriceMap = services.reduce((acc, service) => {
            acc[service._id.toString()] = service.price;
            return acc;
        }, {});

        const totalRevenue = bookings.reduce((sum, booking) => {
            const price = servicePriceMap[booking.serviceId.toString()] || 0;
            return sum + price;
        }, 0);

        return {
            clientCount,
            totalBookings,
            completedServices,
            totalRevenue,
        };
    }
}
