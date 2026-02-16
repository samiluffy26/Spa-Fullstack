import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Heart, Sparkles, Star, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ServiceCard from '../components/features/ServiceCard';
import { useServices } from '../hooks';

/**
 * Página de inicio - Landing page del spa
 * 
 * Secciones:
 * - Hero con llamado a la acción principal
 * - Servicios populares
 * - Beneficios/características
 * - Testimonios
 * - CTA final
 */
const Home = () => {
  const { getPopularServices, isLoading, error } = useServices();
  const popularServices = getPopularServices(3);

  return (
    <div className="min-h-screen">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-sage-50 via-primary-50 to-white py-20 overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Texto */}
            <div className="space-y-8 animate-fadeIn">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  ✨ Tu oasis de tranquilidad
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight">
                Renueva tu
                <span className="block text-primary-600">cuerpo y mente</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Experimenta la perfecta armonía entre bienestar y relajación.
                Tratamientos personalizados con productos naturales de primera calidad.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking">
                  <Button variant="primary" size="lg" icon={Calendar}>
                    Reserva tu cita
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" icon={Sparkles}>
                    Ver servicios
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-primary-700">500+</p>
                  <p className="text-sm text-gray-600">Clientes felices</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-700">15+</p>
                  <p className="text-sm text-gray-600">Tratamientos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-700">4.9★</p>
                  <p className="text-sm text-gray-600">Valoración</p>
                </div>
              </div>
            </div>

            {/* Imagen/Visual */}
            <div className="relative animate-slideUp">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] bg-gradient-to-br from-primary-200 to-sage-300">
                  {/* Aquí irías tu imagen principal del spa */}
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-32 h-32 text-white/50" />
                  </div>
                </div>

                {/* Floating card */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Promoción especial</p>
                      <p className="text-sm text-gray-600">20% de descuento en tu primera visita</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS POPULARES */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-4">
              Nuestros servicios
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Tratamientos más solicitados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestros servicios más populares, diseñados para tu máximo bienestar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Cargando servicios destacados...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-red-500">
                <p>Error al cargar servicios: {error}</p>
              </div>
            ) : popularServices.length > 0 ? (
              popularServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>No hay servicios destacados disponibles en este momento.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/services">
              <Button variant="outline" size="lg">
                Ver todos los servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20 bg-sage-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Por qué elegirnos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprometidos con tu bienestar y satisfacción
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Beneficio 1 */}
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-gray-900 mb-3">
                Terapeutas Certificados
              </h3>
              <p className="text-gray-600">
                Profesionales altamente capacitados con años de experiencia
              </p>
            </Card>

            {/* Beneficio 2 */}
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-gray-900 mb-3">
                Productos Naturales
              </h3>
              <p className="text-gray-600">
                Solo utilizamos productos orgánicos de la más alta calidad
              </p>
            </Card>

            {/* Beneficio 3 */}
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-gray-900 mb-3">
                Horarios Flexibles
              </h3>
              <p className="text-gray-600">
                Reserva en el horario que mejor se adapte a ti
              </p>
            </Card>

            {/* Beneficio 4 */}
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-gray-900 mb-3">
                Resultados Garantizados
              </h3>
              <p className="text-gray-600">
                Tratamientos efectivos respaldados por la satisfacción de nuestros clientes
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-gray-600">
              Testimonios reales de personas que transformaron su bienestar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <Card className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Una experiencia increíble. El masaje de piedras calientes fue exactamente
                lo que necesitaba. Salí completamente renovada."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">MG</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">María González</p>
                  <p className="text-sm text-gray-500">Cliente frecuente</p>
                </div>
              </div>
            </Card>

            {/* Testimonio 2 */}
            <Card className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "El personal es muy profesional y el ambiente del spa es simplemente perfecto.
                Definitivamente volveré."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">CR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Carlos Rodríguez</p>
                  <p className="text-sm text-gray-500">Cliente nuevo</p>
                </div>
              </div>
            </Card>

            {/* Testimonio 3 */}
            <Card className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Los tratamientos faciales son maravillosos. Mi piel nunca se ha visto mejor.
                ¡Altamente recomendado!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">AS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ana Sánchez</p>
                  <p className="text-sm text-gray-500">Cliente VIP</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-sage-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            ¿Listo para tu experiencia de bienestar?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Reserva tu cita hoy y comienza tu viaje hacia el equilibrio perfecto
            de cuerpo, mente y espíritu.
          </p>
          <Link to="/booking">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50"
            >
              Reservar ahora
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;