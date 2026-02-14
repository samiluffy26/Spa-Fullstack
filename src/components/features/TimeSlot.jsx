import React from 'react';
import { Clock, Check } from 'lucide-react';

/**
 * Componente para mostrar y seleccionar horarios
 * 
 * Grid de horarios disponibles con estados: disponible, seleccionado, ocupado
 */
const TimeSlot = ({ 
  time, 
  isSelected, 
  isAvailable = true, 
  onSelect 
}) => {
  
  const handleClick = () => {
    if (isAvailable) {
      onSelect(time);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isAvailable}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200
        flex flex-col items-center justify-center gap-2
        ${isSelected
          ? 'border-primary-600 bg-primary-50 shadow-md scale-105'
          : isAvailable
            ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'
            : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
        }
      `}
    >
      {/* Ícono de reloj o check */}
      {isSelected ? (
        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      ) : (
        <Clock className={`w-5 h-5 ${isAvailable ? 'text-gray-600' : 'text-gray-400'}`} />
      )}

      {/* Hora */}
      <span className={`
        text-lg font-semibold
        ${isSelected 
          ? 'text-primary-700' 
          : isAvailable 
            ? 'text-gray-900' 
            : 'text-gray-400'
        }
      `}>
        {time}
      </span>

      {/* Estado */}
      <span className={`
        text-xs
        ${isSelected 
          ? 'text-primary-600' 
          : isAvailable 
            ? 'text-gray-500' 
            : 'text-gray-400'
        }
      `}>
        {isSelected 
          ? 'Seleccionado' 
          : isAvailable 
            ? 'Disponible' 
            : 'Ocupado'
        }
      </span>
    </button>
  );
};

/**
 * Contenedor de grid para múltiples TimeSlots
 */
export const TimeSlotsGrid = ({ 
  timeSlots, 
  selectedTime, 
  onSelectTime,
  unavailableSlots = []
}) => {
  
  const isTimeAvailable = (time) => {
    return !unavailableSlots.includes(time);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary-600" />
        <h3 className="font-serif font-semibold text-lg text-gray-900">
          Selecciona un horario
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {timeSlots.map((time) => (
          <TimeSlot
            key={time}
            time={time}
            isSelected={selectedTime === time}
            isAvailable={isTimeAvailable(time)}
            onSelect={onSelectTime}
          />
        ))}
      </div>

      {/* Info adicional */}
      <div className="mt-4 p-3 bg-sage-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <span className="font-medium">Tip:</span> Las reservas tienen una duración según el servicio seleccionado. 
          Llegue 10 minutos antes de su cita.
        </p>
      </div>
    </div>
  );
};

export default TimeSlot;