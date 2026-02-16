import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Loader2,
    AlertCircle,
    ArrowLeft,
    Image as ImageIcon,
    MoreVertical
} from 'lucide-react';
import api from '../utils/api';
import Card from '../components/ui/Card';

const ServicesManager = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchServices = async () => {
        try {
            const response = await api.get('/services');
            setServices(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching services:', err);
            setError('No se pudieron cargar los servicios.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) return;

        try {
            await api.delete(`/services/${id}`);
            setServices(prev => prev.filter(service => service._id !== id));
        } catch (err) {
            console.error('Error deleting service:', err);
            alert('Error al eliminar el servicio');
        }
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
        }).format(value);
    };

    // Helper to render image securely
    const renderImage = (image) => {
        if (!image) return <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-300" /></div>;

        let src = image;
        // Check if it's a relative path from our uploads
        if (image.startsWith('/uploads')) {
            src = `http://localhost:3000${image}`;
        }

        return (
            <img
                src={src}
                alt="Service"
                className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                }}
            />
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <button
                            onClick={() => navigate('/admin')}
                            className="flex items-center text-gray-500 hover:text-gray-700 mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Dashboard
                        </button>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Gestión de Servicios</h1>
                        <p className="text-gray-500 mt-1">Administra el catálogo de servicios ofrecidos.</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/services/new')}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Añadir Nuevo Servicio
                    </button>
                </div>

                {/* Filters & Search */}
                <Card className="mb-6 p-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors py-2"
                        />
                    </div>
                </Card>

                {/* Table / List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500">
                            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            {error}
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="p-16 text-center text-gray-400">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="text-lg font-medium text-gray-500">No se encontraron servicios</p>
                            <p className="text-sm">Intenta con otros términos o añade un nuevo servicio.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Acciones</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredServices.map((service) => (
                                        <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {renderImage(service.image)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{service.name}</div>
                                                <div className="text-xs text-gray-500 max-w-[200px] truncate">{service.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-50 text-primary-700">
                                                    {service.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                {formatCurrency(service.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {service.duration} min
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/services/edit/${service._id}`)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(service._id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServicesManager;
