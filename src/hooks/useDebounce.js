import { useState, useEffect } from 'react';

/**
 * Hook para debounce (retrasar ejecución)
 * 
 * Útil para búsquedas en tiempo real, evita llamadas excesivas
 * 
 * @param {any} value - Valor a debounce
 * @param {number} delay - Delay en milisegundos
 * @returns {any} - Valor con debounce aplicado
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer timeout para actualizar el valor
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar timeout si el valor cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;