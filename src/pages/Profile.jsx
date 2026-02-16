import React, { useState } from 'react';
import { User, Phone, Mail, Save, Loader2, ShieldCheck, Calendar, Star } from 'lucide-react';
import { useAuth } from '../hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Profile = () => {
    const { user, updateProfile, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '' // El email suele ser de solo lectura
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            const result = await updateProfile({
                name: formData.name,
                phone: formData.phone
            });

            if (result.success) {
                setStatus({ type: 'success', message: 'Perfil actualizado correctamente' });
            } else {
                setStatus({ type: 'error', message: result.error || 'Error al actualizar perfil' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Ocurrió un error inesperado' });
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom max-w-4xl">

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar - Resumen del perfil */}
                    <div className="w-full md:w-1/3">
                        <Card className="p-6 text-center shadow-lg border-t-4 border-primary-500">
                            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
                            <p className="text-sm text-gray-500 mb-4">{user.email}</p>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                {user.role === 'admin' ? (
                                    <><ShieldCheck className="w-3 h-3" /> Administrador</>
                                ) : (
                                    <><User className="w-3 h-3" /> Cliente VIP</>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Reservas</p>
                                    <p className="text-lg font-bold text-primary-600">---</p>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Nivel</p>
                                    <p className="text-lg font-bold text-primary-600">Oro</p>
                                </div>
                            </div>
                        </Card>

                        <div className="mt-6 space-y-3">
                            <Card className="p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Mis Citas</p>
                                    <p className="text-xs text-gray-500">Gestiona tus horarios</p>
                                </div>
                            </Card>
                            <Card className="p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                    <Star className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Favoritos</p>
                                    <p className="text-xs text-gray-500">Tus servicios preferidos</p>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Formulario Principal */}
                    <div className="w-full md:w-2/3">
                        <Card className="p-8 shadow-lg">
                            <div className="mb-8">
                                <h1 className="text-2xl font-serif font-bold text-gray-900">Mi Información Personal</h1>
                                <p className="text-gray-600">Actualiza tus datos para una mejor experiencia</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status.message && (
                                    <div className={`p-4 rounded-xl text-sm border ${status.type === 'success'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-red-50 text-red-700 border-red-100'
                                        } animate-fadeIn`}>
                                        {status.message}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Nombre Completo"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        icon={User}
                                        required
                                    />
                                    <Input
                                        label="Teléfono"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        icon={Phone}
                                        placeholder="+123 456 7890"
                                    />
                                </div>

                                <Input
                                    label="Correo Electrónico (No modificable)"
                                    name="email"
                                    value={formData.email}
                                    icon={Mail}
                                    readOnly
                                    disabled
                                    className="bg-gray-50 opacity-70"
                                />

                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isLoading}
                                        icon={isLoading ? Loader2 : Save}
                                        className={isLoading ? 'animate-pulse' : ''}
                                    >
                                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <div className="mt-8 bg-sage-50 rounded-2xl p-6 border border-sage-100">
                            <h3 className="text-sage-800 font-bold mb-2 flex items-center gap-2">
                                <Star className="w-5 h-5" /> ¿Necesitas ayuda?
                            </h3>
                            <p className="text-sage-700 text-sm">
                                Si deseas cambiar tu correo electrónico o eliminar tu cuenta, por favor contacta con soporte técnico o visita nuestro centro de atención.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Profile;
