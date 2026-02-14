import { format, addDays, isWeekend, isBefore, startOfDay} from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear fecha a formato legible en español
export const formatDate = (date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
};

//Formatear fecha corta
export const formatDateShort = (date) => {
    return format(date, 'dd/MM/yyyy'
    );
}

//Formatear hora
export const formatTime = (time) => {
    return time;
};

// Obtener fechas disponibles (próximos 30 días, excluyendo domingos)
export const getAvailableDates = (daysAhead = 30) => {
  const dates = [];
  const today = startOfDay(new Date());
  
  for (let i = 1; i <= daysAhead; i++) {
    const date = addDays(today, i);
    
    // Excluir domingos (0 = domingo)
    if (date.getDay() !== 0) {
      dates.push(date);
    }
  }
  
  return dates;
};

// Verificar si una fecha está en el pasado
export const isPastDate = (date) => {
  return isBefore(startOfDay(date), startOfDay(new Date()));
};

// Obtener nombre del día
export const getDayName = (date) => {
  return format(date, 'EEEE', { locale: es });
};