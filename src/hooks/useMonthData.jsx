import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getCurrentMonthDetails = (offset = 0) => {
  const now = new Date();
  now.setMonth(now.getMonth() + offset);
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString('default', { month: 'long' });
  return { year, month, monthName };
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getStartDayOfMonth = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  return firstDay === 0 ? 6 : firstDay - 1;
};

const useMonthData = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const { year, month, monthName } = getCurrentMonthDetails(monthOffset);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const startDay = getStartDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  useEffect(() => {
    const fetchDays = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'days', monthName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedDays = docSnap.data().days.map((day) => ({
            ...day,
            active: day.active || false,
          }));
          const paddedDays = Array(startDay).fill(null).concat(fetchedDays);
          setDays(paddedDays);
        } else {
          console.warn(`No se encontró el documento para ${monthName}`);
          const emptyDays = Array(daysInMonth).fill(null).map((_, index) => ({
            date: index + 1,
            active: false,
          }));

          await setDoc(docRef, { days: emptyDays });
          const paddedDays = Array(startDay).fill(null).concat(emptyDays);
          setDays(paddedDays);
        }
      } catch (error) {
        console.error('Error obteniendo o creando datos en Firestore:', error);
      }
      setLoading(false);
    };

    fetchDays();
  }, [monthName, startDay, daysInMonth]);

  const changeMonth = ((offset) => {
    setMonthOffset((prev) => prev + offset);
  });

  return {
    days, loading, monthName, changeMonth, monthOffset,
  };
};

export default useMonthData;
