import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { name, email, phone, password, confirmPassword } = formData;

        if (!name || !email || !phone || !password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const result = await register(name, email, phone, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Error al crear la cuenta');
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 animate-fadeIn">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900">
                        Únete a nuestro Spa
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Crea tu cuenta para disfrutar de una experiencia personalizada
                    </p>
                </div>

                <Card className="p-8 shadow-xl border-t-4 border-primary-500">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Nombre completo"
                            name="name"
                            type="text"
                            placeholder="Ej. Juan Pérez"
                            value={formData.name}
                            onChange={handleChange}
                            icon={User}
                            required
                        />

                        <Input
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            icon={Mail}
                            required
                        />

                        <Input
                            label="Teléfono"
                            name="phone"
                            type="tel"
                            placeholder="Ej. +123 456 7890"
                            value={formData.phone}
                            onChange={handleChange}
                            icon={Phone}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Contraseña"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                icon={Lock}
                                required
                            />

                            <Input
                                label="Repetir"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                icon={Lock}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                            icon={isLoading ? Loader2 : ArrowRight}
                            className={isLoading ? 'animate-pulse mt-4' : 'mt-4'}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 underline-offset-4 hover:underline">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </Card>

                <p className="text-center text-xs text-gray-400">
                    Al registrarte, aceptas nuestros <a href="#" className="underline">Términos de Servicio</a> y <a href="#" className="underline">Política de Privacidad</a>.
                </p>
            </div>
        </div>
    );
};

export default Register;
