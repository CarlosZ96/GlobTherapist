import React from 'react';
import Calendar from './Calendar';
import '../stylesheets/Therapy.css';

const Therapy = () => {
  return (
    <div className="Therapy-body">
      <div className="Therapy-title-cont">
        <h1>GLOBTHERAPIST</h1>
      </div>
      <form className="Ask-Therapy">
        <div className="Ask-Therapy-subtittle">
          <h2>Agenda tu terapia</h2>
        </div>
        <div className="Ask-Therapy-fields-conts">
          <div className="Ask-Therapy-field-cont">
            <h3>Nombre completo:</h3>
            <input className="Ask-Therapy-fields-input" type="text" />
          </div>
          <div className="Ask-Therapy-field-cont">
            <h3>Teléfono:</h3>
            <input className="Ask-Therapy-fields-input" type="text" />
          </div>
          <div className="Ask-Therapy-field-cont">
            <h3>Email:</h3>
            <input className="Ask-Therapy-fields-input" type="text" />
          </div>
        </div>
        <hr className="white-line" />
        <div className="Ask-Therapy-txt">
          <h3>Elige el tipo de terapia que deseas:</h3>
        </div>
        <div className="Therapies-cont">
          <div className="Therapy-tittle-cont">
            <h4 className="Therapy-tittle">Fisica</h4>
          </div>
          <div className="Therapy-tittle-cont">
            <h4 className="Therapy-tittle">Lenguaje</h4>
          </div>
          <div className="Therapy-tittle-cont">
            <h4 className="Therapy-tittle">Mental</h4>
          </div>
          <div className="Therapy-tittle-cont">
            <h4 className="Therapy-tittle">Ocupacional</h4>
          </div>
        </div>
        <div className="Therapy-info">
          <h3>Explicanos bevemente por que rquieres tu terapia</h3>
          <p className="Therapy-txt-field">...</p>
        </div>
        <hr className="white-line" />
        <div className="Ask-Therapy-pros-cont">
          <div className="Ask-Therapy-pro-cont">
            <img className="Ask-Therapy-pro-img" src="" alt="" />
            <h4 className="Ask-Therapy-pro-name">name</h4>
          </div>
          <div className="Ask-Therapy-pro-cont">
            <img className="Ask-Therapy-pro-img" src="" alt="" />
            <h4 className="Ask-Therapy-pro-name">name</h4>
          </div>
          <div className="Ask-Therapy-pro-cont">
            <img className="Ask-Therapy-pro-img" src="" alt="" />
            <h4 className="Ask-Therapy-pro-name">name</h4>
          </div>
          <div className="Ask-Therapy-pro-cont">
            <img className="Ask-Therapy-pro-img" src="" alt="" />
            <h4 className="Ask-Therapy-pro-name">name</h4>
          </div>
          <div className="Ask-Therapy-pro-cont">
            <img className="Ask-Therapy-pro-img" src="" alt="" />
            <h4 className="Ask-Therapy-pro-name">name</h4>
          </div>
        </div>
        <div className="Ask-Therapy-txt">
          <h3>¿Que dia y a que horas quieres tu cita?:</h3>
        </div>
        <Calendar />
      </form>
    </div>
  );
};

export default Therapy;
