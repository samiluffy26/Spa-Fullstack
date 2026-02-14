import { useState } from 'react';

/**
 * Hook personalizado para manejar formularios
 * 
 * Simplifica el manejo de inputs, validación y envío
 * 
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function} onSubmit - Función a ejecutar al enviar
 * @param {Function} validate - Función de validación (opcional)
 */
const useForm = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Manejar cambios en inputs
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Manejar blur (cuando el usuario sale del campo)
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar el campo si hay función de validación
    if (validate) {
      const fieldErrors = validate(values);
      if (fieldErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors[name]
        }));
      }
    }
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validar todo el formulario
    if (validate) {
      const formErrors = validate(values);
      setErrors(formErrors);
      
      // Si hay errores, no enviar
      if (Object.keys(formErrors).length > 0) {
        return;
      }
    }

    // Enviar formulario
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error en formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resetear formulario
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  /**
   * Establecer valor de un campo específico
   */
  const setValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Establecer error en un campo específico
   */
  const setError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  /**
   * Establecer múltiples valores
   */
  const setFieldsValue = (newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  return {
    // Valores y estado
    values,
    errors,
    touched,
    isSubmitting,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Funciones de utilidad
    reset,
    setValue,
    setError,
    setFieldsValue
  };
};

export default useForm;