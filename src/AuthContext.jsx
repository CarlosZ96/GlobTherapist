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
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      } else {
        setUserData(null);
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
    pros,
    isAdmin,
    login,
    logout,
  }), [currentUser, userData, pros, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
