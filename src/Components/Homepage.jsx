import React, { useState } from 'react';
import '../stylesheets/homepage.css';
import '../stylesheets/windo.css';
import Globody from './Globody';
import Login from './windows/login';
import Create from './windows/Create';

const Homepage = () => {
  const [showLogin, setShowLogin] = useState(false);

  const toggleLogin = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <div className="Home-Page">
      <header className="Home-Roof">
        <div className="Home-txt"><h1>GTH</h1></div>
        <div className="Home-windows">
          <h2>Especialistas</h2>
          <h2>¿Quiénes somos?</h2>
        </div>
        <div className="Log-Btn-Cont">
          <button type="button" className="Log-Btn" onClick={toggleLogin}>
            <h3>Loguearse</h3>
          </button>
          <button type="button" className="Log-Btn">
            <h3>Crear Cuenta</h3>
          </button>
        </div>
      </header>
      <Globody />
      <div style={{ display: showLogin ? 'block' : 'none' }}>
        <Login />
      </div>
      <Create />
    </div>
  );
};

export default Homepage;
