import { useEffect, useRef } from 'react';

/**
 * Animated modal overlay with backdrop blur and scale-in transition.
 * Closes on backdrop click or Escape key.
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap: focus modal on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidth} glass-card p-6 animate-scale-in focus:outline-none`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-lg font-bold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-card-hover cursor-pointer"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
}
