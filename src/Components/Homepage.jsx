import React from 'react';
import '../stylesheets/homepage.css';

const Homepage = () => {
  return (
    <div className="Home-Page">
      <header className="Home-Roof">
        <div className="Home-txt"><h1>GTH</h1></div>
        <div className="Home-windows">
          <h2>Especialistas</h2>
          <h2>¿Quiénes somos?</h2>
        </div>
        <div>
          <button type="submit">
            <h3>Loguearse</h3>
          </button>
          <button type="submit">
            <h3>Crear Cuenta</h3>
          </button>
        </div>
      </header>
      <div className="Home-body" />
    </div>
  );
};

export default Homepage;
