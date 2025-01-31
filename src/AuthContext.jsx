import React, {
  createContext, useContext, useState, useEffect, useMemo,
} from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import {
  doc, getDoc, collection, getDocs, updateDoc,
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

  // Función para cargar los datos del usuario
  const fetchUserData = async (user) => {
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
  };

  // Función para cargar los datos del profesional
  const fetchProData = async (user) => {
    try {
      const proDoc = await getDoc(doc(db, 'pros', user.uid));
      if (proDoc.exists()) {
        setCurrentPro(proDoc.data());
      }
    } catch (error) {
      console.error('Error fetching pro data: ', error);
    }
  };

  // Función para cargar todos los profesionales
  const fetchAllPros = async () => {
    try {
      const prosCollection = await getDocs(collection(db, 'pros'));
      const prosData = prosCollection.docs.map((proDoc) => ({ id: proDoc.id, ...proDoc.data() }));
      setPros(prosData);
    } catch (error) {
      console.error('Error fetching pros collection:', error);
    }
  };

  // Efecto para manejar la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
        await fetchProData(user);
      } else {
        setUserData(null);
        setCurrentPro(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Efecto para cargar todos los profesionales al inicio
  useEffect(() => {
    fetchAllPros();
  }, []);

  // Método para actualizar las citas del usuario
  const updateUserCitas = async (citas) => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, { Citas: citas });
  };

  // Método para actualizar las citas del profesional
  const updateProMisCitas = async (proId, misCitas) => {
    const proRef = doc(db, 'pros', proId);
    await updateDoc(proRef, { MisCitas: misCitas });
  };

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
    updateUserCitas,
    updateProMisCitas,
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
