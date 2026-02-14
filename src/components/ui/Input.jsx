import React from 'react';

const Input = ({ 
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  className = ''
}) => {
  
  const inputClasses = `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
    }
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${Icon ? 'pl-12' : ''}
    outline-none
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Ícono opcional */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        {/* Input */}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
        />
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

// Componente Textarea
export const Textarea = ({ 
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rows = 4,
  className = ''
}) => {
  
  const textareaClasses = `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
    }
    outline-none resize-none
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={textareaClasses}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

// Componente Select
export const Select = ({ 
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  placeholder = 'Seleccione una opción',
  className = ''
}) => {
  
  const selectClasses = `
    w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
    }
    outline-none bg-white appearance-none cursor-pointer
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={selectClasses}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Flecha custom */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;