import React, { createContext, useContext, useState, useEffect } from 'react';

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
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        localStorage.removeItem('spa_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login - Simula autenticación (en producción sería API)
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Simulación de llamada API (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validación básica
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      // En producción: aquí iría la llamada a tu API
      // const response = await fetch('/api/auth/login', { ... });
      
      // Datos de usuario simulados
      const userData = {
        id: Date.now(),
        name: email.split('@')[0], // Usa parte del email como nombre
        email: email,
        phone: '',
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem('spa_user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register - Simula registro
  const register = async (name, email, phone, password) => {
    try {
      setIsLoading(true);
      
      // Simulación de llamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validaciones básicas
      if (!name || !email || !phone || !password) {
        throw new Error('Todos los campos son requeridos');
      }

      // En producción: llamada a API
      // const response = await fetch('/api/auth/register', { ... });
      
      const userData = {
        id: Date.now(),
        name,
        email,
        phone,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('spa_user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('spa_user');
    setUser(null);
  };

  // Actualizar perfil de usuario
  const updateProfile = async (updates) => {
    try {
      setIsLoading(true);
      
      // Simulación de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...updates };
      
      localStorage.setItem('spa_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { success: false, error: error.message };
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