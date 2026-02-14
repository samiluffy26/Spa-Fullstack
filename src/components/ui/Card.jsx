import React from 'react';

const Card = ({ 
  children, 
  hover = true,
  padding = 'md',
  className = ''
}) => {
  
  // Estilos base
  const baseStyles = 'bg-white rounded-3xl shadow-sm overflow-hidden transition-all duration-300';
  
  // Efecto hover
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  
  // Padding
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const cardClasses = `
    ${baseStyles}
    ${hoverStyles}
    ${paddings[padding]}
    ${className}
  `.trim();

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

// Sub-componente para header de card
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

// Sub-componente para body de card
Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

// Sub-componente para footer de card
Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;