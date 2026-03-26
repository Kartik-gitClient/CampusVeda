import React from 'react';
import { cn } from '../utils/cn';

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-soft transition-colors duration-300">
      <table className={cn("w-full caption-bottom text-sm select-none", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("[&_tr]:border-b dark:[&_tr]:border-gray-800 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("[&_tr:last-child]:border-0 dark:[&_tr]:border-gray-800", className)} {...props} />;
}

export function TableRow({ className, onClick, ...props }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-800",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn("p-4 align-middle text-primary dark:text-gray-300 transition-colors duration-300", className)}
      {...props}
    />
  );
}
