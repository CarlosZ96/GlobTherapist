import React from 'react';
import '../stylesheets/Therapy.css';

const Calendar = () => {
  return (
    <div className="Ask-Therapy-date-cont">
      <div className="Ask-Therapy-month-cont">
        <h3>Enero 2025</h3>
      </div>
      <div className="Ask-Therapy-date-weekly">
        <hr />
        <div className="Ask-Therapy-weekly-days-cont">
          <h4 className="Ask-Therapy-day">Lun</h4>
          <h4 className="Ask-Therapy-day">Mar</h4>
          <h4 className="Ask-Therapy-day">Mie</h4>
          <h4 className="Ask-Therapy-day">Jue</h4>
          <h4 className="Ask-Therapy-day">Vie</h4>
          <h4 className="Ask-Therapy-day">Sab</h4>
          <h4 className="Ask-Therapy-day">Dom</h4>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Calendar;
