/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import useMonthData from '../hooks/useMonthData';
import User from '../img/user.png';
import '../stylesheets/month.css';

const Calendar = ({ collection }) => {
  const {
    days, loading, monthName, changeMonth, monthOffset,
  } = useMonthData();
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const { currentUser } = useAuth();
  const [startTime, setStartTime] = useState(8);
  const [endTime, setEndTime] = useState(22);
  const [selectedTime, setSelectedTime] = useState(7);
  const [selectedDay, setSelectedDay] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleDayClick = (day) => {
    setSelectedDay((prev) => {
      return prev.some((d) => d.date === day.date && d.monthOffset === monthOffset)
        ? prev.filter((d) => !(d.date === day.date && d.monthOffset === monthOffset))
        : [...prev, { date: day.date, monthOffset }];
    });
  };
  const incrementTime = (setter, current) => {
    if (collection === 'pros') {
      if (setter === setStartTime && current < endTime - 1) setter(current + 1);
      if (setter === setEndTime && current < 22) setter(current + 1);
    } else if (collection === 'users' && selectedTime < 22) {
      setSelectedTime(selectedTime + 1);
    }
  };

  const decrementTime = (setter, current) => {
    if (collection === 'pros') {
      if (setter === setStartTime && current > 8) setter(current - 1);
      if (setter === setEndTime && current > startTime + 1) setter(current - 1);
    } else if (collection === 'users' && selectedTime > 7) {
      setSelectedTime(selectedTime - 1);
    }
  };
  const formatTime = (hour) => {
    const period = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return `${formattedHour}:00${period}`;
  };
  const formatTimeRange = (hour) => {
    const start = `${hour > 12 ? hour - 12 : hour}:00${hour >= 12 ? 'pm' : 'am'}`;
    const end = `${hour > 12 ? hour - 12 : hour}:40${hour >= 12 ? 'pm' : 'am'}`;
    return `${start}-${end}`;
  };
  const handleConfirmHours = async () => {
    if (!selectedDay.length) {
      alert('Por favor, selecciona al menos un día.');
      return;
    }

    try {
      const userRef = doc(db, collection, currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log(`El usuario no existe en la colección ${collection}.`);
        return;
      }

      const userData = userSnap.data();
      const horariosKey = collection === 'pros' ? 'horarios' : 'Citas';
      const newHorarios = selectedDay.map(({ date, monthOffset }) => {
        const monthIndex = new Date().getMonth() + monthOffset;
        const calculatedMonthName = new Date(2023, monthIndex).toLocaleString('es-ES', { month: 'long' });

        return collection === 'pros'
          ? {
            date,
            month: calculatedMonthName,
            timeSlots: Array.from(
              { length: endTime - startTime },
              (_, i) => `${formatTime(startTime + i)}-${formatTime(startTime + i + 1)}`,
            ),
          }
          : { date, month: calculatedMonthName, time: formatTime(selectedTime) };
      });

      const updatedHorarios = [...(userData[horariosKey] || []), ...newHorarios];
      await updateDoc(userRef, { [horariosKey]: updatedHorarios });
      console.log(`${horariosKey} confirmados:`, updatedHorarios);
      setIsConfirmed(true);
    } catch (error) {
      console.error('Error al confirmar horarios:', error);
    }
  };
  const handleEditHours = async () => {
    try {
      const userRef = doc(db, collection, currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log(`El usuario no existe en la colección ${collection}.`);
        return;
      }

      const horariosKey = collection === 'pros' ? 'horarios' : 'Citas';
      await updateDoc(userRef, { [horariosKey]: [] });
      console.log(`${horariosKey} eliminados.`);

      setIsConfirmed(false);
    } catch (error) {
      console.error('Error al eliminar horarios:', error);
    }
  };

  return (
    <div className="DynamiCanlendar-cont">
      <div className="calendar-month-cont">
        {monthOffset > -1 && (
          <button
            className="calendar-month-btn"
            type="button"
            onClick={() => changeMonth(-1)}
          >
            ←
          </button>
        )}
        <h2 className="calendar-title">{monthName}</h2>
        {monthOffset < 1 && (
          <button
            className="calendar-month-btn"
            type="button"
            onClick={() => changeMonth(1)}
          >
            →
          </button>
        )}
      </div>
      <hr className="date-blue-line" />
      <div className="calendar-week-cont">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>
      <hr className="date-blue-line" />
      <div className="Choose-Day-Cont">
        <div className="Calendar-cont">
          {days && days.length > 0 && days.map((day, index) => (
            <button
              type="button"
              key={index}
              className={`calendar-day ${selectedDay.some((d) => d.date === day?.date && d.monthOffset === monthOffset) ? 'active' : 'inactive'}`}
              onClick={() => handleDayClick(day)}
              disabled={!day}
            >
              {day ? day.date : ''}
            </button>
          ))}
        </div>
        <div className="Choose-Day-btns-cont">
          <h3 className="Choose-Day-txt">
            {collection === 'users'
              ? 'Elige el día de tu valoración.'
              : '¿Qué días estarás disponible para trabajar?'}
          </h3>
          <div className="Dispos-cont">
            <div className="Dispo-cont">
              <h3>Dispo</h3>
              <div className="Dispos-btn" />
            </div>
            <div className="Dispo-cont">
              <h3>No Dispo</h3>
              <div className="Dispos-btn" />
            </div>
          </div>
        </div>
      </div>
      <hr className="date-blue-line" />
      <div className="Hours-cont">
        {collection === 'pros' ? (
          <div className="Hours-selector">
            <div className="Time-selector">
              <h3>De:</h3>
              <div className="Time-control">
                <button type="button" onClick={() => decrementTime(setStartTime, startTime)}>-</button>
                <div>{formatTime(startTime)}</div>
                <button type="button" onClick={() => incrementTime(setStartTime, startTime)}>+</button>
              </div>
            </div>
            <div className="Time-selector">
              <h3>A:</h3>
              <div className="Time-control">
                <button type="button" onClick={() => decrementTime(setEndTime, endTime)}>-</button>
                <div>{formatTime(endTime)}</div>
                <button type="button" onClick={() => incrementTime(setEndTime, endTime)}>+</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="Hours-selector">
            <h3>Selecciona horario:</h3>
            <div className="Time-control">
              <button type="button" onClick={() => decrementTime()}>-</button>
              <div>{formatTimeRange(selectedTime)}</div>
              <button type="button" onClick={() => incrementTime()}>+</button>
            </div>
          </div>
        )}
        <div className="Confirm-button">
          <button
            type="button"
            className="See-Hours"
            onClick={handleConfirmHours}
            disabled={isConfirmed}
          >
            <h3>{collection === 'pros' ? 'Confirmar mis horarios' : 'Confirmar hora'}</h3>
          </button>
          {isConfirmed && (
            <button type="button" className="Edit-Hours" onClick={handleEditHours}>
              <h3>Editar</h3>
            </button>
          )}
        </div>
      </div>
      <hr className="date-blue-line" />
      <div
        className="Pros-cont"
        style={{ display: collection === 'pros' ? 'none' : 'block' }}
      >
        <div className="Pros-btn-cont">
          <button type="button">
            <h3>Ver pros</h3>
          </button>
        </div>
        <div className="pro-img-def">
          <div className="user-image-comt">
            <img src={User} alt="user" className="pro-img" />
          </div>
        </div>
      </div>
      <div className="DynamiCanlendar-btn-cont">
        <button type="submit">
          <h4>Confirmar</h4>
        </button>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  collection: PropTypes.oneOf(['users', 'pros']).isRequired,
};

export default Calendar;
