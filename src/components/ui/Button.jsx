import React from "react";

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    disabled = false,
    icon: Icon,
    fullWidth = false,  // ✅ AGREGA ESTA LÍNEA
    className = ''
}) => {
    const baseStyles = 'font-medium transition-all duration-300 rounded-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    //Variantes
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md',
        secondary: 'bg-sage-100 text-sage-800 hover:bg-sage-200',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
        ghost: 'text-primary-600 hover:bg-primary-50',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    };
  
    // Tamaños
    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };
  
    // Combinar todas las clases
    const buttonClasses = `
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `.trim();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonClasses}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

export default Button;