import React from 'react';
import { cn } from '../utils/cn';

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-primary">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});
Input.displayName = "Input";
