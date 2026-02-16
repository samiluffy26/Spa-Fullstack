import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isToday,
  isBefore,
  startOfDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import Button from '../ui/Button';

/**
 * Componente de calendario para seleccionar fechas 
 * 
 * Permite navegar por meses y seleccionar una fecha disponible
 */
const Calendar = ({ selectedDate, onSelectDate, disabledDates = [], minDate = new Date(), ...props }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  // Navegar al mes anterior
  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  //Navegar al mes siguiente
  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  // Ir a Hoy
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onSelectDate(today);
  };

  //Verificar si una fecha está deshabilitada
  const isDateDisabled = (date) => {
    //Fecha anterior a minDate
    if (isBefore(startOfDay(date), startOfDay(minDate))) {
      return true;
    }

    //Fechas especificamente desabilitadas por prop
    if (disabledDates.some(disabledDate => isSameDay(date, disabledDate))) {
      return true;
    }

    // Validacion externa personalizada (para settings)
    if (props.isDayDisabled && props.isDayDisabled(date)) {
      return true;
    }

    return false;
  };

  //Manejar seleccion de fecha 
  const handleSelectDate = (date) => {
    if (!isDateDisabled(date)) {
      onSelectDate(date);
    }
  };

  //Generar dias del mes para mostrar en calendario
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { locale: es });
    const endDate = endOfWeek(monthEnd, { locale: es });

    const daysArray = []; // ✅ Corregido de "d6ays"
    let day = startDate;

    while (day <= endDate) {
      daysArray.push(day);
      day = addDays(day, 1);
    }

    return daysArray;
  }, [currentMonth]);

  //Nombres de dias de la semana
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header - Navegación de mes */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex flex-col items-center">
          <h3 className="text-lg font-serif font-semibold text-gray-900 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h3>
          <button
            onClick={handleToday}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-1"
          >
            Ir a hoy
          </button>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const isDisabled = isDateDisabled(day);

          return (
            <button
              key={index}
              onClick={() => handleSelectDate(day)}
              disabled={isDisabled}
              className={`
                aspect-square rounded-lg flex items-center justify-center
                text-sm font-medium transition-all duration-200
                ${!isCurrentMonth
                  ? 'text-gray-300 cursor-default'
                  : isDisabled
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                    : isSelected
                      ? 'bg-primary-600 text-white shadow-md scale-105'
                      : isTodayDate
                        ? 'bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                        : 'text-gray-700 hover:bg-sage-50 hover:text-primary-600'
                }
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-6 h-6 bg-primary-600 rounded-lg"></div>
          <span>Fecha seleccionada</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-6 h-6 bg-primary-50 ring-2 ring-primary-200 rounded-lg"></div>
          <span>Hoy</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-6 h-6 bg-gray-50 rounded-lg"></div>
          <span>No disponible (Domingos cerrado)</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;