import React, { useState } from 'react';
import { Calendar, Clock, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Select } from '../components/ui/Input';
import BookingSummary from '../components/features/BookingSummary';
import { useBooking } from '../hooks';
import { useAuth } from '../hooks';
import { BOOKING_STATUS } from '../utils/constants';

/**
 * Página de mis reservas
 * 
 * Funcionalidades:
 * - Ver todas las reservas del usuario
 * - Filtrar por estado (activas, pasadas, canceladas)
 * - Buscar reservas
 * - Cancelar reservas
 * - Reprogramar reservas
 */
const MyReservations = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    bookings,
    getActiveBookings,
    getPastBookings,
    getUpcomingBookings,
    cancelBooking,
    rescheduleBooking
  } = useBooking();

  const [filter, setFilter] = useState('upcoming'); // upcoming, past, all, cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Inicia sesión para ver tus reservas
            </h2>
            <p className="text-gray-600 mb-6">
              Necesitas una cuenta para gestionar tus reservas
            </p>
            <Link to="/booking">
              <Button variant="primary">
                Hacer una reserva
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Obtener reservas según filtro
  const getFilteredBookings = () => {
    let filtered = [];

    switch (filter) {
      case 'upcoming':
        filtered = getUpcomingBookings();
        break;
      case 'past':
        filtered = getPastBookings();
        break;
      case 'cancelled':
        filtered = bookings.filter(b => b.status === BOOKING_STATUS.CANCELLED);
        break;
      default:
        filtered = bookings;
    }

    // Aplicar búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.serviceName.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredBookings = getFilteredBookings();

  // Handlers
  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedBooking) {
      const result = await cancelBooking(selectedBooking.id);
      if (result.success) {
        setShowCancelModal(false);
        setSelectedBooking(null);
      } else {
        alert('Error al cancelar la reserva');
      }
    }
  };

  const handleRescheduleClick = (booking) => {
    setSelectedBooking(booking);
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    // En una implementación real, aquí abrirías un calendario/selector de fecha
    // Por ahora solo cerraremos el modal
    setShowRescheduleModal(false);
    alert('Función de reprogramación - En desarrollo');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona todas tus citas en un solo lugar
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Búsqueda */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar por servicio o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>

            {/* Filtro de estado */}
            <div className="w-full md:w-64">
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                options={[
                  { value: 'upcoming', label: 'Próximas' },
                  { value: 'past', label: 'Pasadas' },
                  { value: 'cancelled', label: 'Canceladas' },
                  { value: 'all', label: 'Todas' }
                ]}
                icon={Filter}
              />
            </div>

            {/* Botón nueva reserva */}
            <Link to="/booking">
              <Button variant="primary" icon={Calendar}>
                Nueva reserva
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-primary-700 mb-1">
              {getUpcomingBookings().length}
            </p>
            <p className="text-sm text-gray-600">Próximas</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-gray-700 mb-1">
              {getPastBookings().length}
            </p>
            <p className="text-sm text-gray-600">Completadas</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-red-600 mb-1">
              {bookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length}
            </p>
            <p className="text-sm text-gray-600">Canceladas</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {bookings.length}
            </p>
            <p className="text-sm text-gray-600">Total</p>
          </Card>
        </div>

        {/* Lista de reservas */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingSummary
                key={booking.id}
                booking={booking}
                onCancel={handleCancelClick}
                onReschedule={handleRescheduleClick}
                showActions={booking.status === BOOKING_STATUS.CONFIRMED}
              />
            ))}
          </div>
        ) : (
          // Estado vacío
          <Card className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {filter === 'upcoming' ? (
                <Calendar className="w-10 h-10 text-gray-400" />
              ) : (
                <Clock className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'upcoming' && 'No tienes reservas próximas'}
              {filter === 'past' && 'No tienes reservas pasadas'}
              {filter === 'cancelled' && 'No tienes reservas canceladas'}
              {filter === 'all' && searchQuery && 'No se encontraron reservas'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'upcoming' 
                ? '¿Listo para tu próxima experiencia de bienestar?' 
                : 'Ajusta tus filtros o crea una nueva reserva'}
            </p>
            <Link to="/booking">
              <Button variant="primary">
                Hacer una reserva
              </Button>
            </Link>
          </Card>
        )}

      </div>

      {/* Modal de cancelación */}
      <Modal.Confirm
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Cancelar reserva"
        message="¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer."
        confirmText="Sí, cancelar"
        cancelText="No, mantener"
        variant="danger"
      />

      {/* Modal de reprogramación */}
      <Modal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        title="Reprogramar reserva"
      >
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            La función de reprogramación estará disponible próximamente.
            Por ahora, puedes cancelar esta reserva y crear una nueva.
          </p>
          <Button
            variant="primary"
            onClick={() => setShowRescheduleModal(false)}
          >
            Entendido
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default MyReservations;