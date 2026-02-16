import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import {
  Home,
  Services,
  Booking,
  MyReservations,
  Contact,
  Login,
  Register,
  Profile,
  AddService,
  ServicesManager,
  CategoriesManager,
  EditService,
  SettingsManager
} from './pages';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/auth/AdminRoute';

/**
 * Componente principal de la aplicación
 * 
 * Configura todas las rutas y aplica el layout
 */
function App() {
  return (
    <Routes>
      {/* Todas las rutas usan el Layout (Header + Footer) */}
      <Route path="/" element={<Layout />}>

        {/* Página de inicio */}
        <Route index element={<Home />} />

        {/* Catálogo de servicios */}
        <Route path="services" element={<Services />} />

        {/* Detalles de un servicio específico */}
        <Route path="services/:id" element={<Services />} />

        {/* Sistema de reservas */}
        <Route path="booking" element={<Booking />} />

        {/* Panel de reservas del usuario */}
        <Route path="my-reservations" element={<MyReservations />} />

        {/* Página de contacto */}
        <Route path="contact" element={<Contact />} />

        {/* Autenticación */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />

        {/* Rutas de Administrador */}
        <Route path="admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services/new" element={<AddService />} />
          <Route path="services/edit/:id" element={<EditService />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>

        {/* Ruta 404 - Redirige al home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;