import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario del localStorage al montar
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('spa_user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        localStorage.removeItem('spa_user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      setIsLoading(true);

      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;

      // Guardar en localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('spa_user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };

    } catch (error) {
      console.error('Error en login:', error);
      const message = error.response?.data?.message || 'Error en el servidor';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (name, email, phone, password) => {
    try {
      setIsLoading(true);

      const response = await api.post('/auth/register', { name, email, phone, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('spa_user', JSON.stringify(userData));
      setUser(userData);

      return { success: true, user: userData };

    } catch (error) {
      console.error('Error en registro:', error);
      const message = error.response?.data?.message || 'Error en el servidor';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('spa_user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // Actualizar perfil de usuario
  const updateProfile = async (updates) => {
    try {
      setIsLoading(true);

      const response = await api.patch('/users/profile', updates);
      const updatedUser = response.data;

      localStorage.setItem('spa_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si está autenticado
  const isAuthenticated = !!user;

  // Valor que se provee a los componentes
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
