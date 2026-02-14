//Validar el email
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

//Validar telefono (formato: 809-555-5555)
export const validatePhone = (phone) => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phone);
};

//Validarar nombre (solo letras y espacios)
export const validateName = (name) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(name);
};

//Validar formulario de reverva completo 
export const validateBookingForm = (formData) => {
    const errors = {};

    if (!validateName(formData.name)) {
        errors.name = 'Nombre inválido. Solo se permiten letras y espacios.';
    }

    if (!validateEmail(formData.email)) {
        errors.email = 'Email inválido.';
    }

    if (!validatePhone(formData.phone)) {
        errors.phone = 'Teléfono inválido. Formato esperado: 809-555-5555.';
    }

    if (!formData.service) {
        errors.service = 'Debe seleccionar un servicio.';
    }

    if (!formData.date) {
        errors.date = 'Debe seleccionar una fecha.';
    }

    if (!formData.time) {
        errors.time = 'Debe seleccionar una hora.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};