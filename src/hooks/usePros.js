import { useState } from 'react';
import {
  collection, doc, getDocs, getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

// Función para normalizar texto
const normalizeText = (text) => {
  return text
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Separar caracteres y tildes
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
    .replace(/\s+/g, ''); // Eliminar espacios
};

const usePros = () => {
  const [availablePros, setAvailablePros] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [selectedProId, setSelectedProId] = useState(null);

  const filterDates = async (currentUser, therapyType) => {
    try {
      if (!currentUser) {
        console.error('No hay usuario logueado.');
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error('Usuario no encontrado en Firestore.');
        return;
      }

      const userData = userDocSnap.data();
      const firstAppointment = userData.Citas?.[0];

      if (!firstAppointment) {
        console.log('El usuario no tiene citas.');
        return;
      }

      const { month, date, time } = firstAppointment;

      console.log('Cita del usuario:', { month, date, time }); // Depuración

      const prosCollectionRef = collection(db, 'pros');
      const prosQuerySnapshot = await getDocs(prosCollectionRef);

      const matchingPros = [];

      // Normalizar el therapyType
      const normalizedTherapyType = normalizeText(therapyType);
      console.log('therapyType normalizado:', normalizedTherapyType); // Depuración

      prosQuerySnapshot.forEach((proDoc) => {
        const proData = proDoc.data();
        const { horarios, terapias, Nombre } = proData;

        console.log('Profesional:', Nombre); // Depuración
        console.log('Terapias del profesional:', terapias); // Depuración
        console.log('Horarios del profesional:', horarios); // Depuración

        // Normalizar las terapias del profesional
        const normalizedTerapias = terapias?.map((t) => normalizeText(t));
        console.log('Terapias del profesional normalizadas:', normalizedTerapias); // Depuración

        if (normalizedTerapias && normalizedTerapias.includes(normalizedTherapyType)) {
          console.log('El profesional ofrece la terapia:', therapyType); // Depuración

          const hasMatchingSchedule = horarios?.some((horario) => {
            const isMonthMatch = horario.month?.toLowerCase() === month?.toLowerCase();
            const isDateMatch = horario.date === date;
            const isTimeMatch = horario.timeSlots?.some((timeSlot) => {
              const [startTimeStr] = timeSlot.split('-');
              return startTimeStr === time;
            });

            console.log('Coincidencia de horario:', { isMonthMatch, isDateMatch, isTimeMatch }); // Depuración

            return isMonthMatch && isDateMatch && isTimeMatch;
          });

          if (hasMatchingSchedule) {
            console.log('Profesional coincide:', Nombre); // Depuración
            matchingPros.push({ id: proDoc.id, name: Nombre });
          }
        }
      });

      console.log('Profesionales encontrados:', matchingPros); // Depuración
      setAvailablePros(matchingPros);
    } catch (error) {
      console.error('Error al obtener los profesionales:', error);
    }
  };

  return {
    availablePros,
    selectedPro,
    selectedProId,
    setSelectedPro,
    setSelectedProId,
    filterDates,
  };
};

export default usePros;
