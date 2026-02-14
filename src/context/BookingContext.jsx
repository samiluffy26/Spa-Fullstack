import React, { createContext, useContext, useState, useEffect } from 'react';
import { BOOKING_STATUS } from '../utils/constants';

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

  // Cargar reservas del localStorage al montar
  useEffect(() => {
    const loadBookings = () => {
      try {
        const savedBookings = localStorage.getItem('spa_bookings');
        if (savedBookings) {
          setBookings(JSON.parse(savedBookings));
        }
      } catch (error) {
        console.error('Error cargando reservas:', error);
        localStorage.removeItem('spa_bookings');
      }
    };

    loadBookings();
  }, []);

  // Guardar reservas en localStorage cuando cambien
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('spa_bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

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

  // Crear nueva reserva
  const createBooking = async (bookingData) => {
    try {
      setIsLoading(true);
      
      // Simulación de llamada API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validar datos requeridos
      if (!bookingData.service || !bookingData.date || !bookingData.time) {
        throw new Error('Servicio, fecha y hora son requeridos');
      }

      // Crear objeto de reserva completo
      const newBooking = {
        id: `booking_${Date.now()}`,
        serviceId: bookingData.service.id,
        serviceName: bookingData.service.name,
        servicePrice: bookingData.service.price,
        serviceDuration: bookingData.service.duration,
        date: bookingData.date,
        time: bookingData.time,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        notes: bookingData.notes || '',
        status: BOOKING_STATUS.CONFIRMED,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Agregar a la lista de reservas
      setBookings(prev => [newBooking, ...prev]);

      // Limpiar reserva actual
      resetCurrentBooking();

      return { success: true, booking: newBooking };
      
    } catch (error) {
      console.error('Error creando reserva:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar reserva
  const cancelBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      
      // Simulación de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar estado de la reserva
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { 
                ...booking, 
                status: BOOKING_STATUS.CANCELLED,
                updatedAt: new Date().toISOString()
              }
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

  // Reprogramar reserva
  const rescheduleBooking = async (bookingId, newDate, newTime) => {
    try {
      setIsLoading(true);
      
      // Simulación de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar fecha y hora
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? { 
                ...booking, 
                date: newDate,
                time: newTime,
                updatedAt: new Date().toISOString()
              }
            : booking
        )
      );

      return { success: true };
      
    } catch (error) {
      console.error('Error reprogramando reserva:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener reserva por ID
  const getBookingById = (bookingId) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  // Obtener reservas por estado
  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // Obtener reservas activas (confirmadas y pendientes)
  const getActiveBookings = () => {
    return bookings.filter(
      booking => 
        booking.status === BOOKING_STATUS.CONFIRMED || 
        booking.status === BOOKING_STATUS.PENDING
    );
  };

  // Obtener reservas pasadas
  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate < now;
    });
  };

  // Obtener próximas reservas
  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= now && booking.status === BOOKING_STATUS.CONFIRMED;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Verificar disponibilidad de horario
  const isTimeSlotAvailable = (date, time) => {
    // Verificar si ya existe una reserva para esa fecha y hora
    return !bookings.some(
      booking =>
        booking.date === date &&
        booking.time === time &&
        booking.status !== BOOKING_STATUS.CANCELLED
    );
  };

  // Limpiar reserva actual
  const resetCurrentBooking = () => {
    setCurrentBooking({
      service: null,
      date: null,
      time: null,
      notes: ''
    });
  };

  // Valor del contexto
  const value = {
    // Estado
    currentBooking,
    bookings,
    isLoading,
    
    // Setters para reserva actual
    setService,
    setDate,
    setTime,
    setNotes,
    resetCurrentBooking,
    
    // Operaciones CRUD
    createBooking,
    cancelBooking,
    rescheduleBooking,
    
    // Getters
    getBookingById,
    getBookingsByStatus,
    getActiveBookings,
    getPastBookings,
    getUpcomingBookings,
    isTimeSlotAvailable
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;