import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  if (!API_URL) {
    console.error('🛑 VITE_API_URL n\'est pas défini dans le .env du frontend');
    // on ne quitte pas l'application, mais toute requête vers l'API va échouer
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`);
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, motDePasse) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        motDePasse
      });
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        setToken(res.data.token);
        return res.data;
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur de connexion';
      console.error('Login failed:', errorMsg);
      throw err;
    }
  };

  const register = async (nom, email, motDePasse) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        nom,
        email,
        motDePasse
      });
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        setToken(res.data.token);
        return res.data;
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur d\'inscription';
      console.error('Register failed:', errorMsg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
