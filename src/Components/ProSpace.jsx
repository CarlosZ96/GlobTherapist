/* eslint-disable no-unused-vars */
import React from 'react';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';
import Calendar from './CalendarWithToggle';
import '../stylesheets/prospace.css';

const ProSpace = () => {
  const usersCollection = collection(db, 'pros');
  return (
    <div>
      <h1>Prospace</h1>
      <Calendar collection="pros" />
    </div>
  );
};

export default ProSpace;
