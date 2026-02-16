import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    Save,
    AlertCircle,
    CheckCircle,
    Loader2,
    Plus,
    Trash2,
    Settings,
    Users
} from 'lucide-react';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const DAYS_OF_WEEK = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

const SettingsManager = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [settings, setSettings] = useState({
        weeklySchedule: [],
        exceptions: [],
        maxDailyBookings: 20,
        maxGuestsPerBooking: 5
    });

    const [newExceptionDate, setNewExceptionDate] = useState('');
    const [newExceptionReason, setNewExceptionReason] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            // Ensure weeklySchedule has all 7 days if incomplete
            const mergedSchedule = Array.from({ length: 7 }).map((_, index) => {
                const existing = response.data.weeklySchedule?.find(d => d.day === index);
                return existing || {
                    day: index,
                    isOpen: false,
                    openTime: '09:00',
                    closeTime: '18:00'
                };
            });

            setSettings({
                ...response.data,
                weeklySchedule: mergedSchedule,
                exceptions: response.data.exceptions || []
            });
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('No se pudo cargar la configuración.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleChange = (index, field, value) => {
        const newSchedule = [...settings.weeklySchedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setSettings(prev => ({ ...prev, weeklySchedule: newSchedule }));
    };

    const handleLimitChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    const addException = () => {
        if (!newExceptionDate) return;
        setSettings(prev => ({
            ...prev,
            exceptions: [
                ...prev.exceptions,
                { date: newExceptionDate, type: 'closed', reason: newExceptionReason || 'Cerrado' }
            ]
        }));
        setNewExceptionDate('');
        setNewExceptionReason('');
    };

    const removeException = (index) => {
        setSettings(prev => ({
            ...prev,
            exceptions: prev.exceptions.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.patch('/settings', settings);
            setSuccess('Configuración guardada correctamente.');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            setError('Error al guardar la configuración.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary-500 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <Settings className="w-8 h-8 text-primary-600" />
                        Ajustes y Disponibilidad
                    </h1>
                    <p className="text-gray-500 mt-2">Configura los horarios de apertura, días feriados y límites de reservas.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Weekly Schedule */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-500" />
                            Horario Semanal
                        </h2>
                        <div className="space-y-4">
                            {settings.weeklySchedule.map((day, index) => (
                                <div key={day.day} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-32 font-medium text-gray-700">
                                        {DAYS_OF_WEEK[day.day]}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={day.isOpen}
                                                onChange={(e) => handleScheduleChange(index, 'isOpen', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {day.isOpen ? 'Abierto' : 'Cerrado'}
                                            </span>
                                        </label>
                                    </div>

                                    {day.isOpen && (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="time"
                                                value={day.openTime}
                                                onChange={(e) => handleScheduleChange(index, 'openTime', e.target.value)}
                                                className="block rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="time"
                                                value={day.closeTime}
                                                onChange={(e) => handleScheduleChange(index, 'closeTime', e.target.value)}
                                                className="block rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Exceptions */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary-500" />
                            Días Cerrados / Excepciones
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <input
                                type="date"
                                value={newExceptionDate}
                                onChange={(e) => setNewExceptionDate(e.target.value)}
                                className="block rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            <input
                                type="text"
                                placeholder="Razón (ej. Feriado)"
                                value={newExceptionReason}
                                onChange={(e) => setNewExceptionReason(e.target.value)}
                                className="block flex-1 rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            <Button type="button" onClick={addException} icon={Plus}>
                                Añadir
                            </Button>
                        </div>

                        {settings.exceptions.length > 0 ? (
                            <div className="space-y-3">
                                {settings.exceptions.map((ex, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
                                        <div className="flex gap-4">
                                            <span className="font-medium">{ex.date}</span>
                                            <span className="text-red-500">({ex.reason})</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeException(index)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-sm">No hay días cerrados configurados.</p>
                        )}
                    </Card>

                    {/* Limits */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-500" />
                            Límites de Capacidad
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Máximo de reservas por día
                                </label>
                                <input
                                    type="number"
                                    name="maxDailyBookings"
                                    min="1"
                                    value={settings.maxDailyBookings}
                                    onChange={handleLimitChange}
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Límite total de citas que se pueden agendar en un solo día.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Máximo de personas por reserva
                                </label>
                                <input
                                    type="number"
                                    name="maxGuestsPerBooking"
                                    min="1"
                                    value={settings.maxGuestsPerBooking}
                                    onChange={handleLimitChange}
                                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Cantidad máxima de huéspedes permitidos en una sola reserva.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Guardar Configuración
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsManager;
