import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../../stylesheets/windo.css';
import { auth, db } from '../../firebase';

const Create = ({ toggleCreate, toggleCreatePro }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    userName: '',
    password: '',
  });

  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const { user } = userCredential;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        Nombre: formData.userName,
        Documento: {
          tipo: 'DNI',
          numero: '00000000',
        },
        email: formData.email,
        telefono: formData.phone,
        Citas: [],
        role: 'usuario',
      });

      alert('Usuario creado con éxito');
      setFormData({
        email: '', phone: '', userName: '', password: '',
      });
      toggleCreate();
    } catch (error) {
      console.error('Error creando el usuario:', error);
      alert('Hubo un error al crear el usuario');
    }
  };

  return (
    <div className="Create-cont">
      <form className="Create-body" onSubmit={handleSubmit}>
        <div className="Create-title-cont">
          <h1>Crear Usuario</h1>
        </div>
        <div className="Create-input-cont">
          <h3>Correo:</h3>
          <input
            type="email"
            name="email"
            className="Create-input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="Create-input-cont">
          <h3>Telefono:</h3>
          <input
            type="number"
            name="phone"
            className="Create-input"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="Create-input-cont">
          <h3>Nombre De Usuario:</h3>
          <input
            type="text"
            name="userName"
            className="Create-input"
            value={formData.userName}
            onChange={handleChange}
          />
        </div>
        <div className="Create-input-cont">
          <h3>Contraseña:</h3>
          <input
            type="password"
            name="password"
            className="Create-input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="create-submit-cont">
          <button type="submit">
            <h3>Confirmar</h3>
          </button>
        </div>
        <div className="Create-pro-popup">
          <h4>¿Eres profesional de la salud?</h4>
          <button
            type="button"
            onClick={() => setShowMoreInfo(!showMoreInfo)}
          >
            Saber más
          </button>
        </div>
      </form>

      {showMoreInfo && (
        <div className="overlay">
          <div className="info-popup">
            <p>
              Si eres profesional y te gustaría trabajar con nosotros, puedes
              registrarte y brindar tus servicios de terapias en línea.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowMoreInfo(false);
                toggleCreate();
                toggleCreatePro();
              }}
            >
              Crear Cuenta Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Create.propTypes = {
  toggleCreate: PropTypes.func.isRequired,
  toggleCreatePro: PropTypes.func.isRequired,
};

export default Create;
