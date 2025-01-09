import React from 'react';
import '../stylesheets/homepage.css';
import Globody from './Globody';

const Homepage = () => {
  return (
    <div className="Home-Page">
      <header className="Home-Roof">
        <div className="Home-txt"><h1>GTH</h1></div>
        <div className="Home-windows">
          <h2>Especialistas</h2>
          <h2>¿Quiénes somos?</h2>
        </div>
        <div className="Log-Btn-Cont">
          <button type="submit" className="Log-Btn">
            <h3>Loguearse</h3>
          </button>
          <button type="submit" className="Log-Btn">
            <h3>Crear Cuenta</h3>
          </button>
        </div>
      </header>
      <Globody />
    </div>
  );
};

export default Homepage;
