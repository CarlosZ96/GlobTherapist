/* eslint-disable react/no-array-index-key */
import React from 'react';
import useMonthData from '../hooks/useMonthData';
import User from '../img/user.png';
import '../stylesheets/month.css';

const CalendarWithToggle = () => {
  const {
    days, loading, toggleDayStatus, monthName, changeMonth, monthOffset,
  } = useMonthData();
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="DynamiCanlendar-cont">
      <div className="Calendar-cont">
        <div className="date-calendar-header">
          {monthOffset > -1 && (
            <button type="button" onClick={() => changeMonth(-1)}>← Mes Anterior</button>
          )}
          <h2 className="date-calendar-title">{monthName}</h2>
          {monthOffset < 1 && (
            <button type="button" onClick={() => changeMonth(1)}>Mes Siguiente →</button>
          )}
        </div>
        <hr className="date-blue-line" />
        <div className="date-calendar-week-cont">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="date-calendar-day-header">
              {day}
            </div>
          ))}
        </div>
        <hr className="date-blue-line" />
        <div className="date-calendar-grid">
          {days.map((day, index) => (
            <button
              type="button"
              key={index}
              className={`date-calendar-day ${day?.active ? 'active' : 'inactive'}`}
              onClick={() => day && toggleDayStatus(index)}
              disabled={!day}
            >
              {day ? day.date : ''}
            </button>
          ))}
        </div>
      </div>
      <div className="Choose-Day-Cont">
        <h3 className="Choose-Day-txt">Elige el día de tu valoración.</h3>
        <div className="Dispos-cont">
          <div className="Dispo-cont">
            <h3>Dispo</h3>
            <div className="active" />
          </div>
          <div className="Dispo-cont">
            <h3>No Dispo</h3>
            <div className="inactive " />
          </div>
        </div>
        <hr className="blue-line" />
      </div>
      <div className="Hours-cont">
        <h3>¿A que horas?</h3>
        <div className="Hours-Users">
          <button type="button"><h4>7:00am-7:40am</h4></button>
        </div>
        <div className="Hours-btn-cont">
          <button type="button"><h3>Ver horarios</h3></button>
        </div>
        <hr className="blue-line" />
      </div>
      <div className="Pros-cont">
        <div className="Hours-btn-cont">
          <button type="button"><h3>Ver pros</h3></button>
        </div>
        <div className="pro-img-def">
          <img src={User} alt="user-image" className="pro-img" />
        </div>
      </div>
      <div className="DynamiCanlendar-btn-cont">
        <button type="submit"><h4>Confirmar</h4></button>
      </div>
    </div>
  );
};

export default CalendarWithToggle;
