import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, 
  Facebook, Instagram, Twitter,
  Heart, Clock, Award
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sage-900 text-white">
      
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-sage-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-serif font-bold text-white">R</span>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">
                  Relax<span className="text-primary-400">Spa</span>
                </h3>
              </div>
            </div>
            <p className="text-sage-300 leading-relaxed mb-6">
              Tu oasis de tranquilidad y bienestar. Tratamientos personalizados 
              para renovar cuerpo, mente y espíritu.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sage-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sage-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sage-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-sage-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>→</span> Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-sage-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>→</span> Nuestros Servicios
                </Link>
              </li>
              <li>
                <Link 
                  to="/booking" 
                  className="text-sage-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>→</span> Reservar Cita
                </Link>
              </li>
              <li>
                <Link 
                  to="/my-reservations" 
                  className="text-sage-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>→</span> Mis Reservas
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sage-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>→</span> Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sage-300">
                <MapPin className="w-5 h-5 mt-1 text-primary-400 flex-shrink-0" />
                <span>
                  Av. Winston Churchill #123<br />
                  Santo Domingo, República Dominicana
                </span>
              </li>
              <li>
                <a 
                  href="tel:+18095551234" 
                  className="flex items-center gap-3 text-sage-300 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary-400" />
                  <span>(809) 555-1234</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@relaxspa.com" 
                  className="flex items-center gap-3 text-sage-300 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span>info@relaxspa.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Features */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6">
              Horarios
            </h4>
            <ul className="space-y-3 text-sage-300 mb-6">
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="font-medium text-white">Lun - Vie</p>
                  <p className="text-sm">9:00 AM - 7:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="font-medium text-white">Sábados</p>
                  <p className="text-sm">10:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="font-medium text-white">Domingos</p>
                  <p className="text-sm">Cerrado</p>
                </div>
              </li>
            </ul>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sage-300 text-sm">
                <Award className="w-4 h-4 text-primary-400" />
                <span>Terapeutas certificados</span>
              </div>
              <div className="flex items-center gap-2 text-sage-300 text-sm">
                <Heart className="w-4 h-4 text-primary-400" />
                <span>Productos naturales</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sage-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-sage-400">
            <p>
              © {currentYear} RelaxSpa. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Términos
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;