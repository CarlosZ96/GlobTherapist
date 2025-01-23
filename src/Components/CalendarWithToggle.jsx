/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useMonthData from '../hooks/useMonthData';
import User from '../img/user.png';
import '../stylesheets/month.css';

const Calendar = ({ collection }) => {
  const {
    days, loading, toggleDayStatus, monthName, changeMonth, monthOffset,
  } = useMonthData();
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeHours, setActiveHours] = useState([]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDayClick = (index) => {
    if (collection === 'users') {
      setSelectedDay(index);
    } else if (collection === 'pros') {
      toggleDayStatus(index);
    }
  };

  const handleHourClick = (hour) => {
    setActiveHours((prev) => (prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]));
  };

  const handleConfirmHours = () => {
    if (collection === 'pros') {
      const activeDays = days
        .map((day, index) => (day?.active ? day.date : null))
        .filter((day) => day !== null);

      console.log('Mes actual:', monthName);
      console.log('Días activos:', activeDays);
      console.log('Horarios activos:', activeHours);
    }
  };

  const generateHourButtons = () => {
    const hours = [];
    let startTime = 7 * 60;
    const endTime = 22 * 60;
    while (startTime < endTime) {
      const nextTime = startTime + 40;
      const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'pm' : 'am';
        const formattedHour = hours > 12 ? hours - 12 : hours;
        return `${formattedHour}:${mins === 0 ? '00' : mins}${period}`;
      };
      const startHour = formatTime(startTime);
      const endHour = formatTime(nextTime);
      hours.push(`${startHour}-${endHour}`);
      startTime = (Math.floor(startTime / 60) + 1) * 60;
    }
    return hours;
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
          {days.map((day, index) => (
            <button
              type="button"
              key={index}
              className={`calendar-day ${collection === 'users'
                ? selectedDay === index
                  ? 'active'
                  : 'inactive'
                : day?.active
                  ? 'active'
                  : 'inactive'
                }`}
              onClick={() => handleDayClick(index)}
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
        <div className="Hours-btn-cont">
          <button className="See-Hours" type="button" onClick={handleConfirmHours}>
            <h3>{collection === 'pros' ? 'Confirmar mis horarios' : 'Ver horarios'}</h3>
          </button>
        </div>
        <div className="Hours-Users">
          {generateHourButtons().map((timeSlot, index) => (
            <button
              key={index}
              className={`Hour-btn ${activeHours.includes(timeSlot) ? 'active' : 'inactive'}`}
              type="button"
              onClick={() => handleHourClick(timeSlot)}
            >
              <h4>{timeSlot}</h4>
            </button>
          ))}
        </div>
        <h3>¿A qué horas?</h3>
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
