import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import useForm from '../hooks/useForm';
import { validateEmail, validateName, validatePhone } from '../utils/validators';

/**
 * Página de contacto
 * 
 * Secciones:
 * - Información de contacto
 * - Formulario de contacto
 * - Mapa de ubicación (placeholder)
 * - Horarios de atención
 */
const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validación del formulario
  const validate = (values) => {
    const errors = {};

    if (!validateName(values.name)) {
      errors.name = 'Nombre inválido (mínimo 2 caracteres)';
    }

    if (!validateEmail(values.email)) {
      errors.email = 'Email inválido';
    }

    if (!validatePhone(values.phone)) {
      errors.phone = 'Teléfono inválido (formato: 809-555-1234)';
    }

    if (!values.subject || values.subject.trim().length < 3) {
      errors.subject = 'Asunto debe tener al menos 3 caracteres';
    }

    if (!values.message || values.message.trim().length < 10) {
      errors.message = 'Mensaje debe tener al menos 10 caracteres';
    }

    return errors;
  };

  // Submit handler
  const handleSubmit = async (values) => {
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Formulario enviado:', values);
    setIsSubmitted(true);

    // Reset después de 5 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
    }, 5000);
  };

  // Usar hook de formulario
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    reset
  } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    },
    handleSubmit,
    validate
  );

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-sage-700 text-white py-20">
<div className="container-custom text-center">
<h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
Contáctanos
</h1>
<p className="text-xl text-primary-100 max-w-2xl mx-auto">
Estamos aquí para responder tus preguntas y ayudarte a encontrar
el tratamiento perfecto para ti
</p>
</div>
</section>
  <div className="container-custom py-12">
    <div className="grid lg:grid-cols-3 gap-8">
      
      {/* Columna izquierda - Info de contacto */}
      <div className="space-y-6">
        
        {/* Dirección */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600 leading-relaxed">
                Av. Winston Churchill #123<br />
                Santo Domingo, DN 10001<br />
                República Dominicana
              </p>
            </div>
          </div>
        </Card>

        {/* Teléfono */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
              <a 
                href="tel:+18095551234"
                className="text-primary-600 hover:text-primary-700 transition-colors block"
              >
                (809) 555-1234
              </a>
              <a 
                href="tel:+18095551235"
                className="text-primary-600 hover:text-primary-700 transition-colors block"
              >
                (809) 555-1235
              </a>
            </div>
          </div>
        </Card>

        {/* Email */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a 
                href="mailto:info@relaxspa.com"
                className="text-primary-600 hover:text-primary-700 transition-colors block"
              >
                info@relaxspa.com
              </a>
              <a 
                href="mailto:reservas@relaxspa.com"
                className="text-primary-600 hover:text-primary-700 transition-colors block"
              >
                reservas@relaxspa.com
              </a>
            </div>
          </div>
        </Card>

        {/* Horarios */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">Horarios</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes - Viernes</span>
                  <span className="font-medium text-gray-900">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábados</span>
                  <span className="font-medium text-gray-900">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingos</span>
                  <span className="font-medium text-red-600">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* Columna derecha - Formulario */}
      <div className="lg:col-span-2">
        <Card className="p-8">
          
          {isSubmitted ? (
            // Mensaje de éxito
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                ¡Mensaje enviado!
              </h3>
              <p className="text-gray-600 mb-6">
                Gracias por contactarnos. Te responderemos lo antes posible.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
              >
                Enviar otro mensaje
              </Button>
            </div>
          ) : (
            // Formulario
            <>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Envíanos un mensaje
              </h2>
              <p className="text-gray-600 mb-6">
                Completa el formulario y te responderemos en menos de 24 horas
              </p>

              <form onSubmit={onSubmit} className="space-y-6">
                
                {/* Nombre */}
                <Input
                  label="Nombre completo"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                  required
                  placeholder="Ej: Juan Pérez"
                />

                {/* Email y Teléfono en grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                    required
                    placeholder="tu@email.com"
                  />

                  <Input
                    label="Teléfono"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && errors.phone}
                    required
                    placeholder="809-555-1234"
                  />
                </div>

                {/* Asunto */}
                <Input
                  label="Asunto"
                  name="subject"
                  type="text"
                  value={values.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.subject && errors.subject}
                  required
                  placeholder="¿En qué podemos ayudarte?"
                />

                {/* Mensaje */}
                <Textarea
                  label="Mensaje"
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.message && errors.message}
                  required
                  rows={6}
                  placeholder="Cuéntanos más sobre tu consulta..."
                />

                {/* Botón enviar */}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                  icon={Send}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                </Button>

              </form>
            </>
          )}

        </Card>
      </div>

    </div>

    {/* Mapa (placeholder) */}
    <div className="mt-12">
      <Card className="overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-sage-200 to-primary-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-sage-600 mx-auto mb-4" />
            <p className="text-sage-700 font-medium">
              Mapa de ubicación
            </p>
            <p className="text-sm text-sage-600 mt-2">
              (Aquí iría un iframe de Google Maps)
            </p>
          </div>
        </div>
      </Card>
    </div>

  </div>

</div>
);
};
export default Contact;