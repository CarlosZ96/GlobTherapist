/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import '../stylesheets/windo.css';

const CreatePro = ({ toggleCreatePro }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    documentType: 'C.C',
    documentNumber: '',
    email: '',
    phone: '',
    therapies: [],
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [certificationFiles, setCertificationFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTherapyToggle = (therapy) => {
    setFormData((prev) => ({
      ...prev,
      therapies: prev.therapies.includes(therapy)
        ? prev.therapies.filter((t) => t !== therapy)
        : [...prev.therapies, therapy],
    }));
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleMultipleFilesChange = (e) => {
    setCertificationFiles(Array.from(e.target.files));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.fullName.trim()) validationErrors.fullName = 'Nombre completo es obligatorio.';
    if (!formData.documentNumber.trim()) validationErrors.documentNumber = 'Número de documento es obligatorio.';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) validationErrors.email = 'Correo electrónico inválido.';
    if (!formData.phone.trim()) validationErrors.phone = 'Número de teléfono es obligatorio.';
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const proId = `${formData.documentType}-${formData.documentNumber}`;
      const proDocRef = doc(db, 'pros', proId);
      const uploadFile = async (file, folder) => {
        const storageRef = ref(storage, `${folder}/${proId}/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      };

      const [imageUrl, cvUrl, certificationsUrls] = await Promise.all([
        imageFile ? uploadFile(imageFile, 'images') : null,
        cvFile ? uploadFile(cvFile, 'cv') : null,
        Promise.all(certificationFiles.map((file) => uploadFile(file, 'certifications'))),
      ]);

      await setDoc(proDocRef, {
        fullName: formData.fullName,
        document: { type: formData.documentType, number: formData.documentNumber },
        email: formData.email,
        phone: formData.phone,
        imageUrl,
        cvUrl,
        certificationsUrls,
        therapies: formData.therapies,
      });

      alert('Usuario Pro creado con éxito');
      toggleCreatePro();
    } catch (error) {
      console.error('Error creando el usuario Pro:', error);
      alert('Hubo un error al crear el usuario Pro.');
    }
  };

  return (
    <div className="Create-overlay">
      <div className="Create-cont">
        <form className="Create-body" onSubmit={handleSubmit}>
          <div className="Create-title-cont">
            <h1>Crear Usuario Pro</h1>
            <div className="close-button" onClick={toggleCreatePro}>&times;</div>
          </div>
          <div className="Create-input-cont">
            <h3>Foto:</h3>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImageFile)} />
          </div>
          <div className="Create-input-cont">
            <h3>Nombre Completo:</h3>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'input-error' : ''}
            />
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          </div>
          <div className="Create-input-cont">
            <h3>Documento:</h3>
            <select name="documentType" value={formData.documentType} onChange={handleChange}>
              <option value="C.C">C.C</option>
              <option value="C.E">C.E</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              className={errors.documentNumber ? 'input-error' : ''}
            />
            {errors.documentNumber && <p className="error-text">{errors.documentNumber}</p>}
          </div>
          <div className="Create-input-cont">
            <h3>Email:</h3>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="Create-input-cont">
            <h3>Teléfono:</h3>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
          <div className="Create-input-cont">
            <h3>Subir Hoja de Vida:</h3>
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setCvFile)} />
          </div>
          <div className="Create-input-cont">
            <h3>Certificaciones:</h3>
            <input type="file" accept=".pdf" multiple onChange={handleMultipleFilesChange} />
          </div>
          <div className="Create-input-cont">
            <h3>¿Con qué terapias vas a trabajar?</h3>
            {['Lenguaje', 'Física', 'Mental', 'Ocupacional'].map((therapy) => (
              <button
                key={therapy}
                type="button"
                className={formData.therapies.includes(therapy) ? 'active' : ''}
                onClick={() => handleTherapyToggle(therapy)}
              >
                {therapy}
              </button>
            ))}
          </div>
          <div className="create-submit-cont">
            <button type="submit"><h3>Confirmar</h3></button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreatePro.propTypes = {
  toggleCreatePro: PropTypes.func.isRequired,
};

export default CreatePro;
