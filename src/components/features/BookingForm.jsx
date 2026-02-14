import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import Input, { Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { useAuth, useForm } from "../../hooks";
import { validateBookingForm } from '../../utils/validators';

/**
 * Formulario completo de reserva
 * 
 * Recopila información del cliente y notas adicionales
 */
const BookingForm = ({ 
  service, 
  date, 
  time, 
  onSubmit, 
  isSubmitting = false 
}) => {
  const { user, isAuthenticated } = useAuth();

  // Valores iniciales del formulario
  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: ''
  };

  // Validación del formulario
  const validate = (values) => {
    const result = validateBookingForm({
      ...values,
      service,
      date,
      time
    });
    return result.errors;
  };

  // Usar hook de formulario
  const {
    values,
    errors,
    touched,
    isSubmitting: formSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(initialValues, onSubmit, validate);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-serif font-semibold text-xl text-gray-900 mb-6">
        Información de contacto
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre completo */}
        <Input
          label="Nombre completo"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && errors.name}
          required
          icon={User}
          placeholder="Ej: Juan Pérez"
        />

        {/* Email */}
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          required
          icon={Mail}
          placeholder="ejemplo@email.com"
        />

        {/* Teléfono */}
        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone && errors.phone}
          required
          icon={Phone}
          placeholder="809-555-1234"
        />

        {/* Notas adicionales */}
        <Textarea
          label="Notas adicionales (opcional)"
          name="notes"
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.notes && errors.notes}
          placeholder="¿Alguna preferencia o condición médica que debamos conocer?"
          rows={4}
        />

        {/* Resumen de la reserva */}
        <div className="bg-sage-50 rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-gray-900 mb-3">Resumen de tu reserva:</h4>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Servicio:</span>
            <span className="font-medium text-gray-900">{service?.name}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duración:</span>
            <span className="font-medium text-gray-900">{service?.duration} minutos</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium text-gray-900">
              {date ? new Date(date).toLocaleDateString('es-DO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '-'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hora:</span>
            <span className="font-medium text-gray-900">{time || '-'}</span>
          </div>
          
          <div className="pt-3 border-t border-sage-200 flex justify-between">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-primary-700">
              ${service?.price}
            </span>
          </div>
        </div>

        {/* Política de cancelación */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Política de cancelación</p>
            <p>
              Puedes cancelar o reprogramar tu cita sin cargo hasta 24 horas antes 
              de la hora programada.
            </p>
          </div>
        </div>

        {/* Botón de envío */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting || formSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;