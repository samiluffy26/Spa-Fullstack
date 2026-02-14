import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Calendar, Heart, Mail } from 'lucide-react';

const Navigation = ({ mobile = false }) => {
  
  const navItems = [
    { 
      path: '/', 
      label: 'Inicio', 
      icon: Home 
    },
    { 
      path: '/services', 
      label: 'Servicios', 
      icon: Sparkles 
    },
    { 
      path: '/booking', 
      label: 'Reservar', 
      icon: Calendar 
    },
    { 
      path: '/my-reservations', 
      label: 'Mis Reservas', 
      icon: Heart 
    },
    { 
      path: '/contact', 
      label: 'Contacto', 
      icon: Mail 
    }
  ];

  // Estilos para desktop
  const desktopLinkClass = ({ isActive }) => `
    px-4 py-2 rounded-full font-medium transition-all duration-200
    ${isActive 
      ? 'bg-primary-50 text-primary-700' 
      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
    }
  `;

  // Estilos para mobile
  const mobileLinkClass = ({ isActive }) => `
    flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200
    ${isActive 
      ? 'bg-primary-50 text-primary-700' 
      : 'text-gray-700 hover:bg-gray-50'
    }
  `;

  if (mobile) {
    // Navegación móvil (vertical)
    return (
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={mobileLinkClass}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    );
  }

  // Navegación desktop (horizontal)
  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={desktopLinkClass}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;