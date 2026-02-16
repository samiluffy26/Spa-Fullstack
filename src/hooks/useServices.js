import { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { CATEGORIES } from '../utils/constants';

/**
 * Hook personalizado para manejar servicios del spa
 */
const useServices = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar servicios al montar el hook
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/services');
      const mappedServices = response.data.map(s => ({ ...s, id: s._id }));
      setServices(mappedServices);

      // Actualizar rango de precios basado en los datos reales
      if (response.data.length > 0) {
        const prices = response.data.map(s => s.price);
        setPriceRange({
          min: Math.min(...prices),
          max: Math.max(...prices)
        });
      }
    } catch (error) {
      console.error('Error cargando servicios:', error);
      setError(error.message || 'Error al cargar servicios');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        service =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }

    filtered = filtered.filter(
      service => service.price >= priceRange.min && service.price <= priceRange.max
    );

    return filtered;
  }, [services, selectedCategory, searchQuery, priceRange]);

  // Restablecer funciones de ayuda para compatibilidad
  const getServiceById = (id) => {
    return services.find(service => (service._id || service.id) == id);
  };

  const getPopularServices = (limit = 3) => {
    return services.slice(0, limit);
  };

  const getRecommendedServices = (serviceId, limit = 3) => {
    const currentService = getServiceById(serviceId);
    if (!currentService) return [];
    return services
      .filter(s => s.category === currentService.category && (s._id || s.id) !== serviceId)
      .slice(0, limit);
  };

  const sortServices = (servicesArray, sortBy = 'name') => {
    const sorted = [...servicesArray];
    switch (sortBy) {
      case 'name': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low': return sorted.sort((a, b) => a.price - b.price);
      case 'price-high': return sorted.sort((a, b) => b.price - a.price);
      case 'duration': return sorted.sort((a, b) => a.duration - b.duration);
      default: return sorted;
    }
  };

  const clearFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    if (services.length > 0) {
      const prices = services.map(s => s.price);
      setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
    }
  };

  return {
    services,
    filteredServices,
    selectedCategory,
    searchQuery,
    priceRange,
    isLoading,
    categories: CATEGORIES,
    setSelectedCategory,
    setSearchQuery,
    setPriceRange,
    sortServices,
    clearFilters,
    fetchServices,
    getServiceById,
    getPopularServices,
    getPopularServices,
    getRecommendedServices,
    error // Exportar error
  };
};

export default useServices;
