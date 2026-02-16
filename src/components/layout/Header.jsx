import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, User, LogOut, ChevronDown, ShieldCheck, Calendar } from 'lucide-react';
import Navigation from './Navigation';
import Button from '../ui/Button';
import { useAuth } from '../../hooks';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Top Bar - Info de contacto */}
      <div className="bg-sage-800 text-white py-2 hidden md:block">
        <div className="container-custom">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a
                href="tel:+18095551234"
                className="flex items-center gap-2 hover:text-sage-200 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>(809) 555-1234</span>
              </a>
              <a
                href="mailto:info@relaxspa.com"
                className="flex items-center gap-2 hover:text-sage-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@relaxspa.com</span>
              </a>
            </div>
            <div>
              <span className="text-sage-200">Lun - Sáb: 9:00 AM - 7:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <header
        className={`
          sticky top-0 z-40 transition-all duration-300
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white'
          }
        `}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-sage-600 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="text-2xl font-serif font-bold text-white">R</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  Relax<span className="text-primary-600">Spa</span>
                </h1>
                <p className="text-xs text-gray-500">Centro de Bienestar</p>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden lg:block">
              <Navigation />
            </div>

            {/* Auth/CTA Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/booking">
                    <Button variant="primary">
                      Reservar Cita
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">
                        {user.role === 'admin' ? (
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-2 h-2" /> Admin
                          </span>
                        ) : 'Cliente'}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Dropdown Profile */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right scale-95 group-hover:scale-100 py-2">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4" /> Mi Perfil
                    </Link>
                    <Link to="/my-reservations" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Calendar className="w-4 h-4" /> Mis Reservas
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <ShieldCheck className="w-4 h-4" /> Dashboard Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-0 z-30 lg:hidden transition-all duration-300
          ${isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`
            absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl
            transform transition-transform duration-300
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <Navigation mobile />

            {/* Mobile CTA */}
            <div className="mt-8 space-y-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="block">
                    <Button variant="outline" fullWidth>
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button variant="primary" fullWidth>
                      Registrarse
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 font-bold text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">
                        {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </p>
                    </div>
                  </div>

                  <Link to="/profile" className="block">
                    <Button variant="outline" fullWidth icon={User}>
                      Mi Perfil
                    </Button>
                  </Link>

                  <Link to="/my-reservations" className="block">
                    <Button variant="outline" fullWidth icon={Calendar}>
                      Mis Reservas
                    </Button>
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <a
                href="tel:+18095551234"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>(809) 555-1234</span>
              </a>
              <a
                href="mailto:info@relaxspa.com"
                className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>info@relaxspa.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;