import { useState } from 'react';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useConfirmation = (
  collectionName,
  currentUser,
  selectedDay,
  selectedTime,
  therapyType,
  onDateSelection,
  formatTime,
) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmHours = async () => {
    if (!selectedDay.length || selectedTime === null) {
      alert('Por favor, selecciona al menos un día y una hora.');
      return;
    }

    try {
      const userRef = doc(db, collectionName, currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error('El usuario no existe en Firestore.');
        return;
      }

      const userData = userSnap.data();
      const prevCitas = userData.Citas || [];

      const newCitas = selectedDay.map(({ date, monthOffset }) => {
        const monthIndex = new Date().getMonth() + monthOffset;
        const calculatedMonthName = new Date(2023, monthIndex).toLocaleString('es-ES', { month: 'long' });

        return {
          date,
          month: calculatedMonthName.toLowerCase(),
          time: formatTime(selectedTime),
          therapyType,
          status: 'pending',
        };
      });

      const updatedCitas = [...prevCitas, ...newCitas];
      await updateDoc(userRef, { Citas: updatedCitas });
      console.log('Citas creadas en Firestore:', updatedCitas);
      alert('Citas confirmadas correctamente.');
      setIsConfirmed(true);
      onDateSelection(updatedCitas); // Llamar a onDateSelection aquí
    } catch (error) {
      console.error('Error al confirmar horarios:', error);
    }
  };

  const handleEditHours = async () => {
    try {
      const userRef = doc(db, collectionName, currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log(`El usuario no existe en la colección ${collectionName}.`);
        return;
      }

      const horariosKey = collectionName === 'pros' ? 'horarios' : 'Citas';
      await updateDoc(userRef, { [horariosKey]: [] });
      console.log(`${horariosKey} eliminados.`);
      setIsConfirmed(false);
    } catch (error) {
      console.error('Error al eliminar horarios:', error);
    }
  };

  return {
    isConfirmed,
    handleConfirmHours,
    handleEditHours,
  };
};

export default useConfirmation;
