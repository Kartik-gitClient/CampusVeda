import React from 'react';
import { cn } from '../utils/cn';

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-primary text-white",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
