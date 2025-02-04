// usePros.js
import { useState } from 'react';
import {
  collection, doc, getDocs, getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

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

      const prosCollectionRef = collection(db, 'pros');
      const prosQuerySnapshot = await getDocs(prosCollectionRef);

      const matchingPros = [];

      prosQuerySnapshot.forEach((proDoc) => {
        const proData = proDoc.data();
        const { horarios, terapias, Nombre } = proData;

        if (terapias && terapias.includes(therapyType)) {
          const hasMatchingSchedule = horarios?.some((horario) => {
            const isMonthMatch = horario.month?.toLowerCase() === month?.toLowerCase();
            const isDateMatch = horario.date === date;
            const isTimeMatch = horario.timeSlots?.some((timeSlot) => {
              const [startTimeStr] = timeSlot.split('-');
              return startTimeStr === time;
            });

            return isMonthMatch && isDateMatch && isTimeMatch;
          });

          if (hasMatchingSchedule) {
            matchingPros.push({ id: proDoc.id, name: Nombre });
          }
        }
      });

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
