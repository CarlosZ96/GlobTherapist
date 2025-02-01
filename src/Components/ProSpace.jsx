/* eslint-disable no-unused-vars */
import React from 'react';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';
import Calendar from './CalendarWithToggle';
import ProData from './ProData';
import '../stylesheets/prospace.css';

const ProSpace = () => {
  const usersCollection = collection(db, 'pros');
  return (
    <div className="prospace-cont">
      <Calendar collection="pros" />
      <ProData />
    </div>
  );
};

export default ProSpace;
