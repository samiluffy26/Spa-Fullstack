import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Users,
    Calendar,
    CheckCircle,
    DollarSign,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Plus,
    X,
    AlertTriangle,
    Tag,
    Settings
} from 'lucide-react';
import api from '../utils/api';
import Card from '../components/ui/Card';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/admin/stats');
            setStats(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching admin stats:', err);
            setError('Error al cargar las estadísticas del panel');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
        }).format(value);
    };

    if (isLoading && !stats) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Ingresos Totales',
            value: stats ? formatCurrency(stats.totalRevenue) : '$0.00',
            icon: DollarSign,
            color: 'bg-green-500',
            trend: '+12.5%',
            trendUp: true,
            description: 'Basado en servicios completados'
        },
        {
            title: 'Clientes Registrados',
            value: stats?.clientCount || 0,
            icon: Users,
            color: 'bg-blue-500',
            trend: '+4%',
            trendUp: true,
            description: 'Usuarios activos en la plataforma'
        },
        {
            title: 'Total de Reservas',
            value: stats?.totalBookings || 0,
            icon: Calendar,
            color: 'bg-purple-500',
            trend: '-2%',
            trendUp: false,
            description: 'Reservas totales históricas'
        },
        {
            title: 'Servicios Realizados',
            value: stats?.completedServices || 0,
            icon: CheckCircle,
            color: 'bg-orange-500',
            trend: '+18%',
            trendUp: true,
            description: 'Citas marcadas como completadas'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Panel Administrativo</h1>
                        <p className="text-gray-500">Resumen y métricas clave del negocio</p>
                    </div>
                    <button
                        onClick={fetchStats}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Actualizar datos
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 border border-red-100 flex items-center gap-3">
                        <X className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((card, idx) => (
                        <Card key={idx} className="p-6 hover:shadow-lg transition-all duration-300 border-b-4 border-transparent hover:border-primary-500">
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-2xl ${card.color} text-white shadow-lg`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                {card.trend && (
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${card.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {card.trend}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{card.title}</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                                <p className="text-xs text-gray-400 mt-2 italic">{card.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions / Future Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-primary-500" />
                            Rendimiento Semanal
                        </h3>
                        <div className="h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 flex-col gap-2">
                            <RefreshCw className="w-10 h-10 animate-pulse" />
                            <p className="text-sm font-medium">Cargando gráfico de tendencias...</p>
                        </div>
                    </Card>

                    <Card className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/admin/bookings')}
                                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Gestionar Reservas</span>
                            </button>
                            <button
                                onClick={() => navigate('/admin/services/new')}
                                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Añadir Nuevo Servicio</span>
                            </button>
                            <button
                                onClick={() => navigate('/admin/services')}
                                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                                <div className="p-2 bg-sage-50 text-sage-600 rounded-lg">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Gestionar Servicios</span>
                            </button>
                            <button
                                onClick={() => navigate('/admin/categories')}
                                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Gestionar Categorías</span>
                            </button>
                            <button className="w-full text-left p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Reportar Incidencia</span>
                            </button>
                            <button
                                onClick={() => navigate('/admin/settings')}
                                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Ajustes y Disponibilidad</span>
                            </button>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
