import { useState, useEffect } from 'react';

/**
 * Hook personalizado para sincronizar estado con localStorage
 * 
 * @param {string} key - Clave del localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 * @returns {Array} [storedValue, setValue]
 */
const useLocalStorage = (key, initialValue) => {
  // Estado que se sincroniza con localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Intentar cargar del localStorage
      const item = window.localStorage.getItem(key);
      
      // Parsear el JSON o retornar valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error cargando ${key} de localStorage:`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = (value) => {
    try {
      // Permitir que value sea función (como useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error guardando ${key} en localStorage:`, error);
    }
  };

  // Sincronizar con cambios en otros tabs/ventanas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;