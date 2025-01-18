/* eslint-disable react/no-array-index-key */
import React from 'react';
import useMonthData from '../hooks/useMonthData';
import '../stylesheets/month.css';

const CalendarWithToggle = () => {
  const {
    days, loading, toggleDayStatus, monthName,
  } = useMonthData();
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">{monthName}</h2>
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
        {days.map((day, index) => (
          <button
            type="button"
            key={index}
            className={`calendar-day ${day.active ? 'active' : 'inactive'}`}
            onClick={() => toggleDayStatus(index)}
          >
            {day.date}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarWithToggle;
