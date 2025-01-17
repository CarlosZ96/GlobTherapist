/* eslint-disable no-shadow */
import React, {
  createContext, useContext, useState, useEffect, useMemo,
} from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import {
  doc, getDoc, collection, getDocs,
} from 'firebase/firestore';
import { auth, db } from './firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [pros, setPros] = useState([]);
  const [currentPro, setCurrentPro] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setIsAdmin(data.role === 'admin');
          } else {
            console.error('No user data found in Firestore');
          }
          const proDoc = await getDoc(doc(db, 'pros', user.uid));
          if (proDoc.exists()) {
            setCurrentPro(proDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      } else {
        setUserData(null);
        setCurrentPro(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchPros = async () => {
      try {
        const prosCollection = await getDocs(collection(db, 'pros'));
        const prosData = prosCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPros(prosData);
      } catch (error) {
        console.error('Error fetching pros collection:', error);
      }
    };

    fetchPros();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const value = useMemo(() => ({
    currentUser,
    userData,
    currentPro,
    pros,
    isAdmin,
    login,
    logout,
  }), [currentUser, userData, currentPro, pros, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
