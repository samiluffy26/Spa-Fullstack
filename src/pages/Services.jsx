import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import ServiceCard from '../components/features/ServiceCard';
import { useServices } from '../hooks';
import { CATEGORIES } from '../utils/constants';

/**
 * Página de servicios - Catálogo completo
 * 
 * Funcionalidades:
 * - Búsqueda por nombre/descripción
 * - Filtro por categoría
 * - Filtro por rango de precio
 * - Ordenamiento
 */
const Services = () => {
  const {
    filteredServices,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    clearFilters,
    sortServices,
    error,
    isLoading
  } = useServices();

  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Servicios ordenados
  const sortedServices = sortServices(filteredServices, sortBy);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Explora nuestra selección de tratamientos diseñados para tu bienestar y relajación
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Búsqueda */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>

            {/* Filtro de categoría */}
            <div className="w-full lg:w-64">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={CATEGORIES.map(cat => ({
                  value: cat.id,
                  label: cat.name
                }))}
              />
            </div>

            {/* Ordenar */}
            <div className="w-full lg:w-48">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'name', label: 'Nombre' },
                  { value: 'price-low', label: 'Precio: Menor a mayor' },
                  { value: 'price-high', label: 'Precio: Mayor a menor' },
                  { value: 'duration', label: 'Duración' }
                ]}
              />
            </div>

            {/* Botón filtros avanzados (mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={SlidersHorizontal}
              className="lg:hidden"
            >
              Filtros
            </Button>
          </div>

          {/* Filtros avanzados (expandible en mobile) */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-slideDown">
              <div className="grid md:grid-cols-2 gap-6">

                {/* Rango de precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rango de precio: ${priceRange.min} - ${priceRange.max}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({
                        ...priceRange,
                        min: parseInt(e.target.value)
                      })}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({
                        ...priceRange,
                        max: parseInt(e.target.value)
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Botón limpiar filtros */}
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    fullWidth
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-center">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Resultados */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {sortedServices.length} servicio{sortedServices.length !== 1 ? 's' : ''} encontrado{sortedServices.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de servicios */}
        {sortedServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Services;