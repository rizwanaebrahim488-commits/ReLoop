import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-charcoal-100`}>
          <div className="flex items-center justify-between border-b border-charcoal-100 px-6 py-4">
            <h3 className="text-lg font-bold text-charcoal-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-charcoal-400 hover:bg-charcoal-100 hover:text-charcoal-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
