import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../AuthContext';
import '../../stylesheets/windo.css';

const Login = ({ toggleLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      toggleLogin();
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <form className="Log-cont" onSubmit={handleSubmit}>
      <div>
        <h1>Iniciar sesión</h1>
      </div>
      <div>
        <h3>Correo:</h3>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <h3>Contraseña:</h3>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="error">{error}</div>}
      <div>
        <button type="submit">
          <h3>Confirmar</h3>
        </button>
      </div>
    </form>
  );
};

Login.propTypes = {
  toggleLogin: PropTypes.func.isRequired,
};

export default Login;
