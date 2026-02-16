import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    MoreVertical,
    AlertCircle
} from 'lucide-react';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/dateFormatter';

const BookingsManager = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    // Cargar todas las reservas
    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/bookings');
            // Ordenar por fecha (más reciente primero)
            const sortedBookings = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setBookings(sortedBookings);
            setError('');
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Error al cargar las reservas');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Actualizar estado de reserva
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            // Optimistic update
            setBookings(prev => prev.map(b =>
                b._id === id ? { ...b, status: newStatus } : b
            ));

            await api.patch(`/bookings/${id}`, { status: newStatus });

        } catch (err) {
            console.error('Error updating booking status:', err);
            // Revertir si falla (opcional, por simplicidad solo mostramos alerta)
            alert('Error al actualizar el estado de la reserva');
            fetchBookings(); // Recargar para asegurar estado correcto
        }
    };

    // Filtrar reservas
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const matchesSearch =
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.serviceId?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" /> Confirmada
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" /> Cancelada
                    </span>
                );
            case 'pending':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" /> Pendiente
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Gestión de Reservas</h1>
                        <p className="text-gray-500">Administra y revisa todas las citas del spa</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded-lg border border-gray-200 flex items-center">
                            {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-all
                      ${filterStatus === status
                                            ? 'bg-primary-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }
                    `}
                                >
                                    {status === 'all' ? 'Todas' :
                                        status === 'pending' ? 'Pendientes' :
                                            status === 'confirmed' ? 'Confirmadas' : 'Canceladas'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente o servicio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Cargando reservas...</p>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredBookings.map((booking) => (
                            <Card key={booking._id} className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">

                                    {/* Info Principal */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {booking.serviceId?.name || 'Servicio eliminado'}
                                            </h3>
                                            {getStatusBadge(booking.status)}
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary-500" />
                                                <span>{formatDate(new Date(booking.date))}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary-500" />
                                                <span>{booking.time} ({booking.serviceId?.duration} min)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-primary-500" />
                                                <span>{booking.customerName}</span>
                                            </div>
                                            {booking.notes && (
                                                <div className="col-span-full mt-2 bg-gray-50 p-2 rounded text-xs italic">
                                                    "{booking.notes}"
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {booking.status === 'pending' && (
                                        <div className="flex md:flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                className="w-full md:w-auto bg-green-600 hover:bg-green-700 border-transparent text-white"
                                            >
                                                Aceptar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                                                className="w-full md:w-auto text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                Rechazar
                                            </Button>
                                        </div>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <div className="flex md:flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                                                className="w-full md:w-auto text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No se encontraron reservas</h3>
                        <p className="text-gray-500">No hay reservas que coincidan con los filtros seleccionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsManager;
