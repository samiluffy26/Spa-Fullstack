// Re-exportar desde contextos
export { useAuth } from '../context/AuthContext';
export { useBooking } from '../context/BookingContext';

// Exportar otros hooks
export { default as useServices } from './useServices';
export { default as useLocalStorage } from './useLocalStorage';
export { default as useForm } from './useForm';
export { default as useDebounce } from './useDebounce';
export { default as useMediaQuery } from './useMediaQuery';