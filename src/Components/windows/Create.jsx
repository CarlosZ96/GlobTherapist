import React from 'react';
import '../../stylesheets/windo.css';

const Create = () => {
  return (
    <form className="Create-cont">
      <div>
        <h1>Iniciar sesion</h1>
      </div>
      <div>
        <h3>Correo:</h3>
        <input type="email" name="email" />
      </div>
      <div>
        <h3>Numero de Telefono:</h3>
        <input type="number" name="phone number" />
      </div>
      <div>
        <h3>Nombre De Usuario:</h3>
        <input type="text" name="user name" />
      </div>
      <div>
        <h3>Nombre De Usuario:</h3>
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

export default Create;
