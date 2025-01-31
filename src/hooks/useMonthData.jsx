import { useState, useEffect } from 'react';
import {
  startOfMonth,
  getDaysInMonth,
  getDay,
  addMonths,
  format,
} from 'date-fns';
import { es } from 'date-fns/locale';

const useMonthData = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [monthName, setMonthName] = useState('');

  useEffect(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = getDay(firstDayOfMonth);

    const emptyDays = Array.from({ length: daysInMonth }, (_, index) => ({
      date: index + 1,
      active: false,
    }));

    const paddedDays = Array(startDay).fill(null).concat(emptyDays);
    setDays(paddedDays);

    // Formatear el nombre del mes en español y en minúsculas
    const formattedMonthName = format(currentDate, 'MMMM yyyy', { locale: es });
    setMonthName(formattedMonthName.toLowerCase()); // Convertir a minúsculas
  }, [currentDate]);

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
