import { useState, useEffect } from 'react';

/**
 * Hook para detectar media queries
 * 
 * Útil para responsive design en JavaScript
 * 
 * @param {string} query - Media query CSS
 * @returns {boolean} - true si coincide la media query
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Crear media query
    const media = window.matchMedia(query);
    
    // Establecer valor inicial
    setMatches(media.matches);

    // Listener para cambios
    const listener = (e) => {
      setMatches(e.matches);
    };

    // Agregar listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export default useMediaQuery;