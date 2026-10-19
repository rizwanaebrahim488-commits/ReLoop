import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-charcoal-100 text-charcoal-700 border-charcoal-200',
    primary: 'bg-forest-100 text-forest-800 border-forest-200',
    success: 'bg-fresh-100 text-fresh-800 border-fresh-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-sky-100 text-sky-800 border-sky-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
