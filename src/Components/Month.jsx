/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import {
  collection, deleteDoc, doc, setDoc, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

const Calendar = () => {
  const [days, setDays] = useState([]);
  const [monthName, setMonthName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  const colors = {
    background: '#2B3A67',
    secondary: '#7C95A6',
    textLight: '#fff',
    textDark: '#000',
  };

  // Helper to get the number of days in a month
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  // Create days array with default structure
  const generateDaysArray = (daysInMonth) => {
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      horario: '',
      proAsignado: '',
      horas: '',
    }));
  };

  // Sync days to Firebase
  const syncToFirebase = async (monthName, daysArray) => {
    const collectionRef = collection(db, monthName);

    // Delete the previous collection
    const existingDocs = await getDocs(collectionRef);
    existingDocs.forEach(async (docSnap) => {
      await deleteDoc(doc(db, monthName, docSnap.id));
    });

    // Add new days
    daysArray.forEach(async (dayData, index) => {
      await setDoc(doc(db, monthName, (index + 1).toString()), dayData);
    });
  };

  // Fetch days from Firebase
  const fetchDaysFromFirebase = async (monthName) => {
    const collectionRef = collection(db, monthName);
    const snapshot = await getDocs(collectionRef);
    const daysArray = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    setDays(daysArray);
  };

  // Handle month transitions
  const handleMonthTransition = async () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    // Get current month name
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const currentMonthName = monthNames[currentMonth];
    setMonthName(currentMonthName);
    setYear(currentYear);

    // Generate days for current month
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const daysArray = generateDaysArray(daysInMonth);

    // If past 21st, remove earlier days and set up next month
    if (currentDay >= 21) {
      const filteredDays = daysArray.filter((day) => day.day >= currentDay);
      setDays(filteredDays);
      await syncToFirebase(currentMonthName, filteredDays);

      // Prepare next month
      const nextMonth = (currentMonth + 1) % 12;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const nextMonthName = monthNames[nextMonth];
      const nextDaysInMonth = getDaysInMonth(nextMonth, nextYear);
      const nextDaysArray = generateDaysArray(nextDaysInMonth);
      await syncToFirebase(nextMonthName, nextDaysArray);
    } else {
      setDays(daysArray);
      await syncToFirebase(currentMonthName, daysArray);
    }
  };

  useEffect(() => {
    handleMonthTransition();
  }, []);

  return (
    <div className="calendar-container" style={{ color: colors.textLight }}>
      <h1>{`${monthName} ${year}`}</h1>
      <div className="calendar-grid">
        {days.map((day) => (
          <div
            key={day.day}
            className="calendar-day"
            style={{
              backgroundColor: day.day === new Date().getDate() ? colors.secondary
               : colors.background,
            }}
          >
            <span>{day.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
