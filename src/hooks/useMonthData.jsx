/* eslint-disable max-len */
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const getCurrentMonthDetails = () => {
  const now = new Date();
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
  const { year, month, monthName } = getCurrentMonthDetails();
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const startDay = getStartDayOfMonth(year, month);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const docRef = doc(db, monthName, 'days');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedDays = docSnap.data().days;
          const paddedDays = Array(startDay).fill(null).concat(fetchedDays);
          setDays(paddedDays);
        } else {
          console.warn(`No se encontró la colección para ${monthName}`);
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
      await setDoc(doc(db, monthName, 'days'), { days: updatedDays.filter(Boolean) });
    } catch (error) {
      console.error('Error actualizando Firestore:', error);
    }
  };

  return {
    days, loading, toggleDayStatus, monthName,
  };
};

export default useMonthData;
