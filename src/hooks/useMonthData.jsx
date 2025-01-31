import { useState, useEffect } from 'react';
import {
  startOfMonth,
  getDaysInMonth,
  getDay,
  addMonths,
  format,
} from 'date-fns';

// Hook principal
const useMonthData = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Fecha actual
  const [days, setDays] = useState([]); // Días del mes
  const [monthName, setMonthName] = useState(''); // Nombre del mes

  useEffect(() => {
    // Obtener el primer día del mes
    const firstDayOfMonth = startOfMonth(currentDate);

    // Obtener la cantidad de días en el mes
    const daysInMonth = getDaysInMonth(currentDate);

    // Obtener el día de la semana en que comienza el mes (0 = Domingo, 6 = Sábado)
    const startDay = getDay(firstDayOfMonth);

    // Crear un array de días para el mes actual
    const emptyDays = Array.from({ length: daysInMonth }, (_, index) => ({
      date: index + 1,
      active: false, // Puedes cambiar esto según tus necesidades
    }));

    // Rellenar los días anteriores al primer día del mes con `null`
    const paddedDays = Array(startDay).fill(null).concat(emptyDays);
    setDays(paddedDays);

    // Obtener el nombre del mes
    setMonthName(format(currentDate, 'MMMM yyyy'));
  }, [currentDate]);

  // Función para cambiar el mes
  const changeMonth = (offset) => {
    setCurrentDate((prevDate) => addMonths(prevDate, offset));
  };

  return {
    days,
    monthName,
    changeMonth,
  };
};

export default useMonthData;
