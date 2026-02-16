import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Calendar as CalendarIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ServiceCard from '../components/features/ServiceCard';
import Calendar from '../components/features/Calendar';
import { TimeSlotsGrid } from '../components/features/TimeSlot';
import BookingForm from '../components/features/BookingForm';
import { useBooking } from '../hooks';
import { useServices } from '../hooks';
import { useAuth } from '../hooks';
import { TIME_SLOTS } from '../utils/constants';
import { formatDate } from '../utils/dateFormatter';
import { isSameDay, parseISO } from 'date-fns';

/**
 * Página de reserva - Wizard multi-paso
 * 
 * Pasos:
 * 1. Seleccionar servicio
 * 2. Seleccionar fecha
 * 3. Seleccionar hora
 * 4. Formulario de datos
 * 5. Confirmación
 */
const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const {
    currentBooking,
    setService,
    setDate,
    setTime,
    createBooking,
    isTimeSlotAvailable,
    resetCurrentBooking,
    settings
  } = useBooking();

  const { services } = useServices();

  // Estado del wizard
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si vienen de ServiceCard con servicio pre-seleccionado
  useEffect(() => {
    if (location.state?.service) {
      setService(location.state.service);
      setStep(2); // Ir directo a selección de fecha
    }
  }, [location.state, setService]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      // Solo limpiar si se completa o se cancela
      // No limpiar en navegación normal para permitir "volver"
    };
  }, []);

  // Handlers
  const handleServiceSelect = (service) => {
    setService(service);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setTime(time);
    setStep(4);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const bookingData = {
        service: currentBooking.service,
        date: currentBooking.date,
        time: currentBooking.time,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        notes: formData.notes
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        setStep(5); // Ir a confirmación

        // Redirigir a "Mis Reservas" después de 3 segundos
        setTimeout(() => {
          navigate('/my-reservations');
        }, 3000);
      } else {
        alert('Error al crear la reserva: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener horarios no disponibles para la fecha seleccionada
  const getUnavailableSlots = () => {
    if (!currentBooking.date) return [];

    return TIME_SLOTS.filter(
      time => !isTimeSlotAvailable(currentBooking.date, time)
    );
  };

  // Indicador de progreso
  const steps = [
    { number: 1, title: 'Servicio' },
    { number: 2, title: 'Fecha' },
    { number: 3, title: 'Hora' },
    { number: 4, title: 'Datos' },
    { number: 5, title: 'Confirmación' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => step === 1 ? navigate(-1) : handleBack()}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Reserva tu cita
          </h1>
          <p className="text-lg text-gray-600">
            Completa los siguientes pasos para confirmar tu reserva
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      font-semibold transition-all duration-300
                      ${step > s.number
                        ? 'bg-primary-600 text-white'
                        : step === s.number
                          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                          : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {step > s.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      s.number
                    )}
                  </div>
                  <span
                    className={`
                      text-sm mt-2 font-medium
                      ${step >= s.number ? 'text-primary-700' : 'text-gray-500'}
                    `}
                  >
                    {s.title}
                  </span>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-4 transition-all duration-300
                      ${step > s.number ? 'bg-primary-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Contenido del paso actual */}
        <div className="max-w-5xl mx-auto">

          {/* PASO 1: Seleccionar servicio */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                Selecciona un servicio
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="cursor-pointer"
                  >
                    <ServiceCard
                      service={service}
                      variant="compact"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: Seleccionar fecha */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                Selecciona una fecha
              </h2>

              {/* Resumen del servicio seleccionado */}
              <Card className="mb-6 p-4 bg-primary-50 border-2 border-primary-200">
                <div className="flex items-center gap-4">
                  <CalendarIcon className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {currentBooking.service?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duración: {currentBooking.service?.duration} min • Precio: ${currentBooking.service?.price}
                    </p>
                  </div>
                </div>
              </Card>

              <Calendar
                selectedDate={currentBooking.date}
                onSelectDate={handleDateSelect}
                minDate={new Date()}
                isDayDisabled={isDayDisabled}
              />
            </div>
          )}

          {/* PASO 3: Seleccionar hora */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                Selecciona un horario
              </h2>

              {/* Resumen */}
              <Card className="mb-6 p-4 bg-primary-50 border-2 border-primary-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Servicio</p>
                    <p className="font-semibold text-gray-900">
                      {currentBooking.service?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-semibold text-gray-900">
                      {currentBooking.date && formatDate(new Date(currentBooking.date))}
                    </p>
                  </div>
                </div>
              </Card>

              <TimeSlotsGrid
                timeSlots={TIME_SLOTS}
                selectedTime={currentBooking.time}
                onSelectTime={handleTimeSelect}
                unavailableSlots={getUnavailableSlots()}
              />
            </div>
          )}

          {/* PASO 4: Formulario de datos */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
                Completa tus datos
              </h2>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Formulario */}
                <div className="lg:col-span-2">
                  <BookingForm
                    service={currentBooking.service}
                    date={currentBooking.date}
                    time={currentBooking.time}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                </div>

                {/* Resumen lateral */}
                <div>
                  <Card className="sticky top-24">
                    <h3 className="font-serif font-semibold text-lg text-gray-900 mb-4">
                      Resumen de reserva
                    </h3>

                    <div className="space-y-4">
                      <div className="pb-4 border-b border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Servicio</p>
                        <p className="font-medium text-gray-900">
                          {currentBooking.service?.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {currentBooking.service?.duration} minutos
                        </p>
                      </div>

                      <div className="pb-4 border-b border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Fecha y hora</p>
                        <p className="font-medium text-gray-900">
                          {currentBooking.date && formatDate(new Date(currentBooking.date))}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {currentBooking.time}
                        </p>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total</span>
                          <span className="text-2xl font-bold text-primary-700">
                            ${currentBooking.service?.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: Confirmación */}
          {step === 5 && (
            <div className="animate-fadeIn text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                ¡Reserva confirmada!
              </h2>

              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Hemos enviado un correo de confirmación a tu email con todos los detalles de tu cita.
              </p>

              <Card className="max-w-md mx-auto mb-8 p-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Detalles de tu reserva:</h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Servicio</p>
                    <p className="font-medium">{currentBooking.service?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">
                      {currentBooking.date && formatDate(new Date(currentBooking.date))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-medium">{currentBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio</p>
                    <p className="font-medium text-primary-700">${currentBooking.service?.price}</p>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => navigate('/my-reservations')}
                >
                  Ver mis reservas
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Volver al inicio
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Redirigiendo automáticamente en 3 segundos...
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Booking;