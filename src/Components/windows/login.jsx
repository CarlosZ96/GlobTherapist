import React from 'react';
import '../../stylesheets/windo.css';

const login = () => {
  return (
    <form className="Log-cont">
      <div>
        <h1>Iniciar sesion</h1>
      </div>
      <div>
        <h3>Correo:</h3>
        <input type="email" name="email" />
      </div>
      <div>
        <h3>Correo:</h3>
        <input type="password" name="password" />
      </div>
      <div>
        <button type="submit">
          <h3>Comfirmar</h3>
        </button>
      </div>
    </form>
  );
};

export default login;
