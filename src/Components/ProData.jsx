import React from 'react';
import User from '../img/user.png';
import '../stylesheets/prospace.css';

const ProData = () => {
  return (
    <div className="prodata-cont">
      <div>
        <h1>Mis datos</h1>
      </div>
      <div className="data-cont">
        <div className="pro-name-cont">
          <div className="user-image-comt">
            <img src={User} alt="user" className="pro-img" />
          </div>
          <h2 className="pro-name">pro name</h2>
        </div>
        <div className="pro-personal-info">
          <div className="hdv-cont">
            <h3 className="upload-hdv">Subir HDV</h3>
          </div>
          <div>
            <h3>Información personal</h3>
            <p>Nombre: </p>
            <p>Email: </p>
            <p>Teléfono: </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProData;
