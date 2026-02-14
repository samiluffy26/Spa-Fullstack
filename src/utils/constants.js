//Estos seran los servicios disponibles en el spa
export const SERVICES = [
    {
        id: 1,
        name: 'Masaje Relajante',
        description: 'Masaje de cuerpo completo con aceites esenciales para aliviar tensiones',
        duration: 60,
        price: 75,
        category: 'masajes',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
        benefits: ['Reduce estrés', 'Mejora circulación', 'Alivia dolores musculares']
    },
    {
        id: 2,
        name: 'Masaje de Piedras Calientes',
        description: 'Terapia con piedras volcánicas calientes para profunda relajación',
        duration: 90,
        price: 95,
        category: 'masajes',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
        benefits: ['Relajación profunda', 'Desintoxicación', 'Equilibrio energético']
    },
    {
        id: 3,
        name: 'Facial Hidratante',
        description: 'Tratamiento facial con productos naturales para piel radiante',
        duration: 60,
        price: 65,
        category: 'faciales',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        benefits: ['Hidratación profunda', 'Anti-edad', 'Luminosidad natural']
    },
    {
        id: 4,
        name: 'Aromaterapia',
        description: 'Sesión de relajación con aceites esenciales terapéuticos',
        duration: 45,
        price: 55,
        category: 'terapias',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
        benefits: ['Reduce ansiedad', 'Mejora sueño', 'Equilibrio emocional']
    },
    {
        id: 5,
        name: 'Exfoliación Corporal',
        description: 'Renovación de la piel con sales minerales del mar',
        duration: 45,
        price: 60,
        category: 'corporales',
        image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80',
        benefits: ['Piel suave', 'Elimina células muertas', 'Estimula renovación']
    }
];

// Estas seran las categorias de los servicios
// ✅ SOLO STRINGS, no componentes React
export const CATEGORIES = [
    { id: 'todos', name: 'Todos los Servicios', icon: 'Sparkles' },
    { id: 'masajes', name: 'Masajes', icon: 'Heart' },
    { id: 'faciales', name: 'Faciales', icon: 'Smile' },
    { id: 'terapias', name: 'Terapias', icon: 'Flame' },
    { id: 'corporales', name: 'Corporales', icon: 'Droplet' }
];

//Horarios disponibles para citas
export const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '18:00', '19:00'
];

//Dias de la semana 
export const WEEK_DAYS = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

//Estados de las citas
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
};