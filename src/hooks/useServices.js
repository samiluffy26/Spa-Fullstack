import { useState, useEffect, useMemo } from 'react';
import { SERVICES, CATEGORIES } from '../utils/constants';

/**
 * Hook personalizado para manejar servicios del spa
 * 
 * Proporciona funcionalidades de filtrado, búsqueda y gestión de servicios
 */
const useServices = () => {
  // Estado para filtros
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  
  // Estado para servicios (en producción vendría de API)
  const [services, setServices] = useState(SERVICES);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Filtrar servicios basado en categoría, búsqueda y precio
   * useMemo previene recalcular en cada render
   */
  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Filtrar por categoría
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(
        service => service.category === selectedCategory
      );
    }

    // Filtrar por búsqueda (nombre o descripción)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        service =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
      );
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(
      service => service.price >= priceRange.min && service.price <= priceRange.max
    );

    return filtered;
  }, [services, selectedCategory, searchQuery, priceRange]);

  /**
   * Obtener servicio por ID
   */
  const getServiceById = (id) => {
    return services.find(service => service.id === parseInt(id));
  };

  /**
   * Obtener servicios por categoría
   */
  const getServicesByCategory = (category) => {
    if (category === 'todos') return services;
    return services.filter(service => service.category === category);
  };

  /**
   * Obtener servicios más populares (simulado)
   * En producción vendría de métricas reales
   */
  const getPopularServices = (limit = 3) => {
    // Simulación: Los primeros 3 servicios son los populares
    return services.slice(0, limit);
  };

  /**
   * Obtener servicios recomendados basados en uno seleccionado
   */
  const getRecommendedServices = (serviceId, limit = 3) => {
    const currentService = getServiceById(serviceId);
    if (!currentService) return [];

    // Recomendar servicios de la misma categoría
    return services
      .filter(
        service => 
          service.category === currentService.category && 
          service.id !== serviceId
      )
      .slice(0, limit);
  };

  /**
   * Ordenar servicios
   */
  const sortServices = (servicesArray, sortBy = 'name') => {
    const sorted = [...servicesArray];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      
      case 'duration':
        return sorted.sort((a, b) => a.duration - b.duration);
      
      default:
        return sorted;
    }
  };

  /**
   * Obtener rango de precios de todos los servicios
   */
  const getPriceRange = () => {
    const prices = services.map(service => service.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  /**
   * Buscar servicios (con debounce simulado)
   */
  const searchServices = (query) => {
    setSearchQuery(query);
  };

  /**
   * Limpiar filtros
   */
  const clearFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setPriceRange(getPriceRange());
  };

  /**
   * Cargar servicios (simulación de API)
   */
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      // Simulación de llamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En producción:
      // const response = await fetch('/api/services');
      // const data = await response.json();
      // setServices(data);
      
      setServices(SERVICES);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicializar rango de precios al montar
   */
  useEffect(() => {
    const range = getPriceRange();
    setPriceRange(range);
  }, [services]);

  // Retornar todo lo que otros componentes necesitan
  return {
    // Estado
    services,
    filteredServices,
    selectedCategory,
    searchQuery,
    priceRange,
    isLoading,
    categories: CATEGORIES,
    
    // Setters
    setSelectedCategory,
    setSearchQuery: searchServices,
    setPriceRange,
    
    // Funciones de utilidad
    getServiceById,
    getServicesByCategory,
    getPopularServices,
    getRecommendedServices,
    sortServices,
    getPriceRange,
    clearFilters,
    fetchServices
  };
};

export default useServices;