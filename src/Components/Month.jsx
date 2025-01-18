/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import {
  doc, setDoc, deleteDoc, collection, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import '../stylesheets/month.css';

const Month = () => {
  const [currentMonth, setCurrentMonth] = useState('');
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCurrentMonthDetails = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString('default', { month: 'long' });
    return { year, month, monthName };
  };

  const saveMonthToFirebase = async (monthName, year, daysInMonth) => {
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
      horario: [],
    }));

    await setDoc(doc(db, monthName, 'days'), { days: daysArray });
    setDays(daysArray);
  };

  const deleteOldDays = async (monthName, currentDay) => {
    const docRef = doc(db, monthName, 'days');
    const docSnapshot = await getDocs(collection(db, monthName));
    const data = docSnapshot.docs[0]?.data();

    if (data) {
      const updatedDays = data.days.filter((day) => day.date >= currentDay);
      await setDoc(docRef, { days: updatedDays });
      setDays(updatedDays);
    }
  };

  const handleNextMonth = async (currentMonthName, nextMonthName, year) => {
    await deleteDoc(collection(db, currentMonthName));
    const daysInNextMonth = getDaysInMonth(year, new Date().getMonth() + 1);
    await saveMonthToFirebase(nextMonthName, year, daysInNextMonth);
  };

  const getStartDayOfMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    return (firstDay.getDay() + 6) % 7;
  };

  useEffect(() => {
    const { year, month, monthName } = getCurrentMonthDetails();
    const daysInMonth = getDaysInMonth(year, month);

    setCurrentMonth(monthName);
    saveMonthToFirebase(monthName, year, daysInMonth);

    const now = new Date();
    const day = now.getDate();

    if (day >= 21) {
      deleteOldDays(monthName, day);

      if (day === daysInMonth) {
        const nextMonthName = new Date(year, month + 1).toLocaleString('default', {
          month: 'long',
        });
        handleNextMonth(monthName, nextMonthName, year);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { year, month } = getCurrentMonthDetails();
  const startDay = getStartDayOfMonth(year, month);
  const paddedDays = Array(startDay).fill(null).concat(days);

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">{currentMonth}</h2>
      <hr className="blue-line" />
      <div className="calendar-week-cont">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>
      <hr className="blue-line" />
      <div className="calendar-grid">
        {paddedDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day ? 'has-day' : ''}`}
          >
            {day ? day.date : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Month;
