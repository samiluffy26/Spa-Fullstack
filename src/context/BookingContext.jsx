import React, { createContext, useContext, useState, useEffect } from 'react';
import { BOOKING_STATUS } from '../utils/constants';
import api from '../utils/api';
import { useAuth } from './AuthContext';

// Crear el contexto
const BookingContext = createContext();

// Hook personalizado
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking debe usarse dentro de BookingProvider');
  }
  return context;
};

// Provider del contexto
export const BookingProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Estado de reserva en progreso
  const [currentBooking, setCurrentBooking] = useState({
    service: null,
    date: null,
    time: null,
    notes: ''
  });

  // Lista de todas las reservas del usuario
  const [bookings, setBookings] = useState([]);

  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Cargar reservas desde la API cuando el usuario está autenticado
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const response = await api.get('/bookings/my-bookings');

        // Mapear datos para compatibilidad con el frontend
        const mappedBookings = response.data.map(b => ({
          ...b,
          id: b._id,
          serviceId: b.serviceId?._id || b.serviceId,
          serviceName: b.serviceId?.name || 'Servicio',
          servicePrice: b.serviceId?.price || 0,
          serviceDuration: b.serviceId?.duration || 0
        }));

        setBookings(mappedBookings);
      } catch (error) {
        console.error('Error cargando reservas desde API:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  // Establecer servicio seleccionado
  const setService = (service) => {
    setCurrentBooking(prev => ({ ...prev, service }));
  };

  // Establecer fecha seleccionada
  const setDate = (date) => {
    setCurrentBooking(prev => ({ ...prev, date }));
  };

  // Establecer hora seleccionada
  const setTime = (time) => {
    setCurrentBooking(prev => ({ ...prev, time }));
  };

  // Establecer notas
  const setNotes = (notes) => {
    setCurrentBooking(prev => ({ ...prev, notes }));
  };

  // Crear nueva reserva en el backend
  const createBooking = async (bookingData) => {
    try {
      setIsLoading(true);

      // Validar datos requeridos
      if (!bookingData.service || !bookingData.date || !bookingData.time) {
        throw new Error('Servicio, fecha y hora son requeridos');
      }

      // Preparar datos para la API
      const bookingPayload = {
        serviceId: bookingData.service._id || bookingData.service.id,
        date: bookingData.date,
        time: bookingData.time,
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        notes: bookingData.notes || '',
      };

      const response = await api.post('/bookings', bookingPayload);
      const rawBooking = response.data;

      // Mapear nueva reserva (aunque el backend post no la devuelva poblada usualmente, 
      // la mapeamos con los datos que ya tenemos para consistencia local inmediata)
      const newBooking = {
        ...rawBooking,
        id: rawBooking._id,
        serviceId: bookingData.service._id || bookingData.service.id,
        serviceName: bookingData.service.name,
        servicePrice: bookingData.service.price,
        serviceDuration: bookingData.service.duration
      };

      // Agregar a la lista de reservas
      setBookings(prev => [newBooking, ...prev]);

      // Limpiar reserva actual
      resetCurrentBooking();

      return { success: true, booking: newBooking };

    } catch (error) {
      console.error('Error creando reserva:', error);
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const rescheduleBooking = async (bookingId, newDate, newTime) => {
    try {
      setIsLoading(true);
      await api.patch(`/bookings/${bookingId}`, { date: newDate, time: newTime });

      setBookings(prev => prev.map(b =>
        (b._id || b.id) === bookingId ? { ...b, date: newDate, time: newTime } : b
      ));

      return { success: true };
    } catch (error) {
      console.error('Error reprogramando:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar reserva en el backend
  const cancelBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      await api.patch(`/bookings/${bookingId}`, { status: 'cancelled' });

      // Actualizar estado local
      setBookings(prev =>
        prev.map(booking =>
          (booking._id || booking.id) === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      return { success: true };

    } catch (error) {
      console.error('Error cancelando reserva:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetCurrentBooking = () => {
    setCurrentBooking({
      service: null,
      date: null,
      time: null,
      notes: ''
    });
  };

  // Helpers de disponibilidad y filtrado
  const isTimeSlotAvailable = (date, time) => {
    return !bookings.some(
      booking =>
        booking.date === date &&
        booking.time === time &&
        booking.status !== 'cancelled'
    );
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= now && booking.status !== 'cancelled';
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getActiveBookings = () => {
    return bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => new Date(booking.date) < now);
  };

  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  const getBookingById = (id) => {
    return bookings.find(b => (b._id || b.id) === id);
  };

  // Valor del contexto
  const value = {
    currentBooking,
    bookings,
    isLoading,
    setService,
    setDate,
    setTime,
    setNotes,
    resetCurrentBooking,
    createBooking,
    cancelBooking,
    rescheduleBooking,
    isTimeSlotAvailable,
    getUpcomingBookings,
    getActiveBookings,
    getPastBookings,
    getBookingsByStatus,
    getBookingById
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
