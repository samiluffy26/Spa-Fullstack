import React from 'react';
import { Calendar, Clock, DollarSign, User, Mail, Phone, MapPin } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatDate } from '../../utils/dateFormatter';

/**
 * Resumen visual de una reserva
 * 
 * Muestra todos los detalles de forma clara y organizada
 */
const BookingSummary = ({ 
  booking, 
  onCancel, 
  onReschedule,
  showActions = true 
}) => {
  
  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
      completed: 'Completada'
    };
    return texts[status] || status;
  };

  return (
    <Card>
      {/* Header con estado */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">
            {booking.serviceName}
          </h3>
          <p className="text-sm text-gray-500">
            ID: {booking.id}
          </p>
        </div>
        <span className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${getStatusColor(booking.status)}
        `}>
          {getStatusText(booking.status)}
        </span>
      </div>

      {/* Detalles del servicio */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="w-5 h-5 text-primary-600" />
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-medium">
              {booking.date ? formatDate(new Date(booking.date)) : '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Clock className="w-5 h-5 text-primary-600" />
          <div>
            <p className="text-sm text-gray-500">Hora</p>
            <p className="font-medium">{booking.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Clock className="w-5 h-5 text-primary-600" />
          <div>
            <p className="text-sm text-gray-500">Duración</p>
            <p className="font-medium">{booking.serviceDuration} minutos</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <DollarSign className="w-5 h-5 text-primary-600" />
          <div>
            <p className="text-sm text-gray-500">Precio</p>
            <p className="font-medium text-primary-700">${booking.servicePrice}</p>
          </div>
        </div>
      </div>

      {/* Información del cliente */}
      <div className="border-t border-gray-100 pt-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Datos del cliente</h4>
<div className="space-y-2 text-sm">
<div className="flex items-center gap-2 text-gray-600">
<User className="w-4 h-4" />
<span>{booking.customerName}</span>
</div>
<div className="flex items-center gap-2 text-gray-600">
<Mail className="w-4 h-4" />
<span>{booking.customerEmail}</span>
</div>
<div className="flex items-center gap-2 text-gray-600">
<Phone className="w-4 h-4" />
<span>{booking.customerPhone}</span>
</div>
</div>
</div>
  {/* Notas */}
  {booking.notes && (
    <div className="bg-sage-50 rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Notas adicionales</h4>
      <p className="text-sm text-gray-600">{booking.notes}</p>
    </div>
  )}

  {/* Ubicación */}
  <div className="bg-primary-50 rounded-lg p-4 mb-6">
    <div className="flex items-start gap-3">
      <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-gray-900 mb-1 text-sm">RelaxSpa</h4>
        <p className="text-sm text-gray-600">
          Av. Winston Churchill #123<br />
          Santo Domingo, República Dominicana
        </p>
      </div>
    </div>
  </div>

  {/* Acciones */}
  {showActions && booking.status === 'confirmed' && (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() => onReschedule?.(booking)}
        className="flex-1"
      >
        Reprogramar
      </Button>
      <Button
        variant="danger"
        onClick={() => onCancel?.(booking)}
        className="flex-1"
      >
        Cancelar
      </Button>
    </div>
  )}
</Card>
);
};
export default BookingSummary;