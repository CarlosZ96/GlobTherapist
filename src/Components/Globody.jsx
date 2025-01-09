import React from 'react';
import med from '../img/HANIS 1.png';
import len from '../img/SyafriStudio 1.png';
import exe from '../img/exercise (1) 1.png';
import bra from '../img/brain 1.png';
import cas from '../img/briefcase 1.png';
import '../stylesheets/homepage.css';

const Globody = () => {
  return (
    <div className="Home-body">
      <div className="GlobThera">
        <h1 className="Glob-title">GLOBTHERAPIST</h1>
        <div className="GlobThera-body">
          <div className="Glob-img-cont">
            <img src={med} alt="" className="Glob-img" />
          </div>
          <div className="Glob-txt-btn-conts">
            <div className="Glob-txt-cont">
              <p>Solicita tu cita en línea desde cualquier lugar.</p>
            </div>
            <div className="Glob-btn-cont">
              <button type="submit">
                <h3>Agenda</h3>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="Theras-cont">
        <div className="Therapy">
          <h3>Lenguaje</h3>
          <div className="Theras-body">
            <img src={len} alt="lenguaje" className="Theras-img" />
            <button type="button" className="Theras-btn">+</button>
          </div>
        </div>
        <div className="Therapy">
          <h3>Fisica</h3>
          <div className="Theras-body">
            <img src={exe} alt="lenguaje" className="Theras-img" />
            <button type="button" className="Theras-btn">+</button>
          </div>
        </div>
        <div className="Therapy">
          <h3>Mental</h3>
          <div className="Theras-body">
            <img src={bra} alt="lenguaje" className="Theras-img" />
            <button type="button" className="Theras-btn">+</button>
          </div>
        </div>
        <div className="Therapy">
          <h3>Ocupacional</h3>
          <div className="Theras-body">
            <img src={cas} alt="lenguaje" className="Theras-img" />
            <button type="button" className="Theras-btn">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Globody;
