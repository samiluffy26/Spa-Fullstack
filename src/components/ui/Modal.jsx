import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true
}) => {
  
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;
  
  // Tamaños del modal
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  
  // Manejar click en overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      {/* Modal Container */}
      <div 
        className={`
          bg-white rounded-3xl shadow-2xl w-full ${sizes[size]}
          transform transition-all duration-300 animate-slideUp
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-serif font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        
        {/* Footer (opcional) */}
        {footer && (
          <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-componente para modal de confirmación
Modal.Confirm = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = '¿Está seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-600">{message}</p>
    </Modal>
  );
};

export default Modal;