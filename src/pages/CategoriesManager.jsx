import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Tag,
    Plus,
    Trash2,
    Loader2,
    AlertCircle,
    ArrowLeft,
    Search
} from 'lucide-react';
import api from '../utils/api';
import Card from '../components/ui/Card';

const CategoriesManager = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('No se pudieron cargar las categorías.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await api.post('/categories', newCategory);
            setCategories([...categories, response.data]);
            setNewCategory({ name: '', description: '' });
        } catch (err) {
            console.error('Error adding category:', err);
            setError(err.response?.data?.message || 'Error al crear la categoría.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c._id !== id));
        } catch (err) {
            console.error('Error deleting category:', err);
            setError('Error al eliminar la categoría.');
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900">Gestión de Categorías</h1>
                            <p className="text-gray-500 mt-2">Administra las categorías de servicios del spa.</p>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            />
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                </div>
                            ) : filteredCategories.length === 0 ? (
                                <div className="text-center p-12 bg-white rounded-2xl border border-gray-100">
                                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No se encontraron categorías.</p>
                                </div>
                            ) : (
                                filteredCategories.map((category) => (
                                    <Card key={category._id} className="p-4 flex items-center justify-between group hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{category.name}</h3>
                                                {category.description && (
                                                    <p className="text-sm text-gray-500">{category.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(category._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Eliminar categoría"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Add Form */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary-500" />
                                Nueva Categoría
                            </h2>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleAddCategory} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Ej. Masajes"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                                    <textarea
                                        rows={3}
                                        value={newCategory.description}
                                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Breve descripción..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newCategory.name.trim()}
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Crear Categoría'
                                    )}
                                </button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesManager;
