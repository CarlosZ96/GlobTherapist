import React, { useState } from 'react';
import '../stylesheets/homepage.css';
import '../stylesheets/windo.css';
import Globody from './Globody';
import Login from './windows/login';
import Create from './windows/Create';
import Therapy from './Therapy';
import { useAuth } from '../AuthContext';

const Homepage = () => {
  const { currentUser, logout, userData } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const toggleLogin = () => {
    setShowLogin((prev) => !prev);
  };

  const toggleCreate = () => {
    setShowCreate((prev) => !prev);
  };

  return (
    <div className="Home-Page">
      <header className="Home-Roof">
        <div className="Home-txt"><h1>GTH</h1></div>
        <div className="Home-windows">
          <h2>Especialistas</h2>
          <h2>¿Quiénes somos?</h2>
        </div>
        {!currentUser ? (
          <div className="Log-Btn-Cont">
            <button type="button" className="Log-Btn" onClick={toggleLogin}>
              <h3>Loguearse</h3>
            </button>
            <button type="button" className="Log-Btn" onClick={toggleCreate}>
              <h3>Crear Cuenta</h3>
            </button>
          </div>
        ) : (
          <div className="Log-Btn-Cont">
            <div>
              <h3>
                Hola,
                {' '}
                {userData?.Nombre || 'Usuario'}
              </h3>
            </div>
            <button type="button" className="Log-Btn" onClick={logout}>
              <h3>Cerrar sesión</h3>
            </button>
          </div>
        )}
      </header>
      <Globody />
      <Therapy />
      <div style={{ display: showLogin ? 'block' : 'none' }}>
        <Login toggleLogin={toggleLogin} />
      </div>
      <div style={{ display: showCreate ? 'block' : 'none' }}>
        <Create toggleCreate={toggleCreate} />
      </div>
    </div>
  );
};

export default Homepage;
