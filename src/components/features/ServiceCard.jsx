import React from 'react';
import { Clock, DollarSign, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * Tarjeta para mostrar un servicio del spa
 * 
 * Muestra información del servicio con imagen, precio, duración y beneficios
 */
const ServiceCard = ({ service, variant = 'default' }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Navegar a página de reserva con el servicio seleccionado
    navigate('/booking', { state: { service } });
  };

  const handleViewDetails = () => {
    // Navegar a detalles del servicio
    navigate(`/services/${service.id}`);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Prepend backend URL for relative paths
    return `http://localhost:3000${imagePath}`;
  };

  // Variante compacta (para listas o grids con muchos items)
  if (variant === 'compact') {
    return (
      <Card hover className="cursor-pointer" onClick={handleViewDetails}>
        <div className="flex gap-4">
          {/* Imagen pequeña */}
          <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-primary-100 to-sage-100 rounded-2xl overflow-hidden">
            {service.image ? (
              <img
                src={getImageUrl(service.image)}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg text-gray-900 mb-1 truncate">
              {service.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {service.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-700">
                <Clock className="w-4 h-4 text-primary-600" />
                {service.duration} min
              </span>
              <span className="flex items-center gap-1 font-semibold text-primary-700">
                <DollarSign className="w-4 h-4" />
                ${service.price}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Variante por defecto (tarjeta completa)
  return (
    <Card hover padding="none" className="group">
      {/* Imagen */}
      <div className="relative h-56 bg-gradient-to-br from-primary-100 to-sage-100 overflow-hidden">
        {service.image ? (
          <img
            src={getImageUrl(service.image)}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-primary-600 opacity-50" />
          </div>
        )}

        {/* Badge de categoría */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-primary-700 capitalize">
            {service.category}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Título y descripción */}
        <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
          {service.name}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Beneficios */}
        {service.benefits && service.benefits.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Beneficios:
            </h4>
            <ul className="space-y-1">
              {service.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Precio y duración */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-primary-600" />
            <span className="font-medium">{service.duration} minutos</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-primary-600" />
            <span className="text-2xl font-bold text-primary-700">
              {service.price}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="flex-1"
          >
            Ver Detalles
          </Button>
          <Button
            variant="primary"
            onClick={handleBookNow}
            className="flex-1"
          >
            Reservar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;