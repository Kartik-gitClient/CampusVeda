import React from 'react';
import { cn } from '../utils/cn';

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-primary dark:text-gray-200 transition-colors duration-300">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-gray-900/50 px-5 py-2 text-primary dark:text-white backdrop-blur-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary/50 focus-visible:bg-white dark:focus-visible:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50",
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
