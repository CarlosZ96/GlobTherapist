/* eslint-disable max-len */
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

  useEffect(() => {
    const fetchDays = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'days', monthName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedDays = docSnap.data().days.map((day, index) => ({
            ...day,
            active: index >= 20 ? day.active : false, // Desactiva días anteriores al 21
          }));
          const paddedDays = Array(startDay).fill(null).concat(fetchedDays);
          setDays(paddedDays);
        } else {
          console.warn(`No se encontró el documento para ${monthName}`);
        }
      } catch (error) {
        console.error('Error obteniendo datos de Firestore:', error);
      }
      setLoading(false);
    };

    fetchDays();
  }, [monthName]);

  const toggleDayStatus = async (dayIndex) => {
    const updatedDays = days.map((day, index) => (day && index === dayIndex ? { ...day, active: !day.active } : day));
    setDays(updatedDays);

    try {
      await setDoc(doc(db, 'days', monthName), { days: updatedDays.filter(Boolean) });
    } catch (error) {
      console.error('Error actualizando Firestore:', error);
    }
  };

  const changeMonth = (offset) => {
    setMonthOffset((prev) => prev + offset);
  };

  return {
    days, loading, toggleDayStatus, monthName, changeMonth, monthOffset,
  };
};

export default useMonthData;
