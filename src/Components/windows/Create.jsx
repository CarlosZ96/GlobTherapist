import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../../stylesheets/windo.css';
import { auth, db } from '../../firebase';

const Create = ({ toggleCreate }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    userName: '',
    password: '',
    role: '',
  });

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
    <form className="Create-cont" onSubmit={handleSubmit}>
      <div>
        <h1>Crear Usuario</h1>
      </div>
      <div>
        <h3>Correo:</h3>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3>Numero de Telefono:</h3>
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3>Nombre De Usuario:</h3>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
      </div>
      <div>
        <h3>Contraseña:</h3>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <button type="submit">
          <h3>Confirmar</h3>
        </button>
      </div>
    </form>
  );
};

Create.propTypes = {
  toggleCreate: PropTypes.func.isRequired,
};

export default Create;
