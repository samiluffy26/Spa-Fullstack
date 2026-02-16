import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Error al iniciar sesión');
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
                        Bienvenido de nuevo
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Accede a tu cuenta para gestionar tus reservas
                    </p>
                </div>

                <Card className="p-8 shadow-xl border-t-4 border-primary-500">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Correo electrónico"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={Mail}
                                required
                            />

                            <Input
                                label="Contraseña"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={Lock}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Recordarme
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                            icon={isLoading ? Loader2 : ArrowRight}
                            className={isLoading ? 'animate-pulse' : ''}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 underline-offset-4 hover:underline">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Admin hint for testing */}
                <div className="text-center text-xs text-gray-400 mt-4">
                    <p>Para pruebas de Admin: samuel@admin.com / admin123</p>
                    <p className="italic mt-1">(Asegúrate de que este usuario exista en la BD)</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
