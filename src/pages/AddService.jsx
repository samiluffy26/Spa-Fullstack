import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Image as ImageIcon,
    Upload,
    Loader2,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    DollarSign,
    Clock,
    Tag,
    FileText,
    Type
} from 'lucide-react';
import api from '../utils/api';
import Card from '../components/ui/Card';

const AddService = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageMode, setImageMode] = useState('upload'); // 'upload' or 'url'
    const [previewUrl, setPreviewUrl] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        duration: '',
        image: null, // File object
        imageUrl: '' // String URL
    });

    const categories = [
        'Masajes',
        'Faciales',
        'Corporales',
        'Relax',
        'Parejas',
        'Especiales'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({
            ...prev,
            imageUrl: url
        }));
        setPreviewUrl(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('price', formData.price);
            data.append('duration', formData.duration);

            if (imageMode === 'upload' && formData.image) {
                data.append('image', formData.image);
            } else if (imageMode === 'url' && formData.imageUrl) {
                // If backend supports URL string in 'image' field directly or handle generic 'image' field
                // Based on backend implementation, if it expects a file or a string.
                // Our backend checks for file first. If we want to send URL, we might need to send it as a distinct field 
                // OR duplicate the logic.
                // Current backend logic: if (file) createServiceDto.image = path. 
                // So if we send a 'image' text field it might bind to createServiceDto.image automatically if Body parser works before interceptor?
                // Actually NestJS @Body() will map the text fields. 
                // So we can append 'image' as text if no file is provided.
                data.append('image', formData.imageUrl);
            }

            await api.post('/services', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/admin');
        } catch (err) {
            console.error('Error creating service:', err);
            setError(err.response?.data?.message || 'Error al crear el servicio');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Dashboard
                </button>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Añadir Nuevo Servicio</h1>
                        <p className="text-gray-500 mt-2">Completa la información para registrar un nuevo servicio en el catálogo.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary-500" />
                                    Información Básica
                                </h3>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Type className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                                placeholder="Ej. Masaje Relajante Premium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                        <textarea
                                            name="description"
                                            required
                                            rows={3}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                            placeholder="Descripción detallada del servicio..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-primary-500" />
                                    Detalles y Precio
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                        <select
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio (DOP)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="price"
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="duration"
                                                required
                                                min="0"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                                placeholder="60"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Image */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary-500" />
                                    Imagen del Servicio
                                </h3>

                                <div className="flex gap-4 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('upload')}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${imageMode === 'upload'
                                                ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-500'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        Subir Archivo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('url')}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${imageMode === 'url'
                                                ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-500'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        Usar URL
                                    </button>
                                </div>

                                {imageMode === 'upload' ? (
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary-400 transition-colors bg-gray-50 hover:bg-primary-50/10">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                                                    <span>Seleccionar archivo</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                                </label>
                                                <p className="pl-1">o arrastrar y soltar</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                                        <input
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={handleUrlChange}
                                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                    </div>
                                )}

                                {previewUrl && (
                                    <div className="mt-4 relative rounded-xl overflow-hidden shadow-md aspect-video">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewUrl('');
                                                setFormData(prev => ({ ...prev, image: null, imageUrl: '' }));
                                            }}
                                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-600 hover:text-red-500 transition-colors shadow-sm"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Guardar Servicio
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddService;
