import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import Calendar from './CalendarWithToggle';
import '../stylesheets/Therapy.css';

const Therapy = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const {
    currentUser,
    updateUserCitas,
    updateProMisCitas,
    pros,
  } = useAuth();

  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [showAppointmentError, setShowAppointmentError] = useState(false);
  const [selectedPro, setSelectedPro] = useState(null);

  const handleDateSelection = (appointments) => {
    console.log('Citas seleccionadas recibidas:', appointments);
    setSelectedAppointments(appointments);
    setShowAppointmentError(false);
  };

  const handleProSelection = (proName) => {
    setSelectedPro(proName);
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: user?.email || '',
    therapyType: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    therapyType: '',
  });

  const fieldRefs = {
    name: React.createRef(),
    phone: React.createRef(),
    email: React.createRef(),
    therapyType: React.createRef(),
  };

  const normalizeText = (text) => {
    return text
      .normalize('NFD') // Normaliza caracteres con tildes
      .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
      .toLowerCase(); // Convierte a minúsculas
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      therapyType: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
      if (fieldRefs.name.current) {
        fieldRefs.name.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
      if (fieldRefs.phone.current) {
        fieldRefs.phone.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
      if (fieldRefs.email.current) {
        fieldRefs.email.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      isValid = false;
    }
    if (!formData.therapyType) {
      newErrors.therapyType = 'Debes elegir un tipo de terapia';
      if (fieldRefs.therapyType.current) {
        fieldRefs.therapyType.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleTherapyTypeClick = (type) => {
    setFormData({ ...formData, therapyType: type });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      console.error('El formulario no es válido.');
      return;
    }

    if (!currentUser) {
      console.error('Usuario no autenticado.');
      alert('Debes iniciar sesión para agendar una cita.');
      return;
    }

    if (selectedAppointments.length === 0) {
      setShowAppointmentError(true);
      return;
    }

    if (!selectedPro) {
      alert('Por favor, selecciona un profesional.');
      return;
    }

    try {
      const normalizedTherapyType = normalizeText(formData.therapyType);

      const updatedCitas = selectedAppointments.map((app) => ({
        ...app,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        therapyType: normalizedTherapyType,
        description: formData.description,
        status: 'confirmed',
      }));

      await updateUserCitas(updatedCitas);

      const pro = pros.find((p) => p.Nombre === selectedPro);
      if (!pro) {
        console.error('Profesional no encontrado.');
        alert('El profesional seleccionado no existe.');
        return;
      }

      const newMisCitas = selectedAppointments.map((app) => ({
        date: app.date,
        time: app.time,
        month: app.month.toLowerCase(),
        therapyType: normalizedTherapyType,
        description: formData.description,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        status: 'pending',
      }));

      await updateProMisCitas(pro.id, newMisCitas);

      alert('¡Formulario enviado exitosamente!');

      setFormData({
        name: '',
        phone: '',
        email: user?.email || '',
        therapyType: '',
        description: '',
      });
      setSelectedAppointments([]);
      setSelectedPro(null);
      setShowAppointmentError(false);
    } catch (error) {
      console.error('Error al actualizar los datos en Firestore:', error);
      alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData((prevData) => ({
            ...prevData,
            phone: userData.telefono || 'Teléfono no encontrado',
          }));
        } else {
          console.error('No se encontró el documento del usuario en Firestore.');
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <form className="Therapy-body" onSubmit={handleSubmit}>
      <div className="Therapy-title-cont">
        <h1>GLOBTHERAPIST</h1>
      </div>
      <div className="Ask-Therapy">
        <div className="Ask-Therapy-subtittle">
          <h2>Agenda tu terapia</h2>
        </div>
        <div className="Ask-Therapy-fields-conts">
          <div className="Ask-Therapy-field-cont">
            <h3>Nombre completo:</h3>
            <input
              ref={fieldRefs.name}
              className="Ask-Therapy-fields-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <h5 className="error-text">{errors.name}</h5>}
          </div>
          <div className="Ask-Therapy-field-cont">
            <h3>Teléfono:</h3>
            <input
              ref={fieldRefs.phone}
              className="Ask-Therapy-fields-input"
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <h5 className="error-text">{errors.phone}</h5>}
          </div>
          <div className="Ask-Therapy-field-cont">
            <h3>Email:</h3>
            <input
              ref={fieldRefs.email}
              className="Ask-Therapy-fields-input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <h5 className="error-text">{errors.email}</h5>}
          </div>
        </div>
        <hr className="white-line" />
        <div className="Ask-Therapy-txt">
          <h3>Elige el tipo de terapia que deseas:</h3>
        </div>
        <div className="Therapies-cont">
          {['Fisica', 'Lenguaje', 'Mental', 'Ocupacional'].map((type) => (
            <button
              key={type}
              type="button"
              className={
                formData.therapyType === type
                  ? 'Therapy-tittle-cont Therapy-tittle'
                  : 'inactive-cont inactive-txt'
              }
              onClick={() => handleTherapyTypeClick(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {errors.therapyType && (
          <div className="error-container">
            <h5 className="error-text">{errors.therapyType}</h5>
          </div>
        )}
        <div className="Therapy-info">
          <textarea
            className="Therapy-txt-field"
            placeholder="Explícanos brevemente por qué requieres tu terapia."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <hr className="white-line" />
        <div className="Ask-Therapy-txt">
          <h3>¿Qué día y a qué horas quieres tu cita?</h3>
        </div>
        <div className="calendar-cont">
          <Calendar
            collection="users"
            onDateSelection={handleDateSelection}
            therapyType={formData.therapyType}
            onProSelection={handleProSelection}
          />
          {showAppointmentError && (
            <div className="appointment-error">
              <h5 className="error-text">Por favor, selecciona al menos una cita.</h5>
            </div>
          )}
        </div>
        <div className="DynamiCanlendar-btn-cont">
          <button type="submit" className="DynamiCanlendar-btn">
            <h4>Confirmar</h4>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Therapy;
