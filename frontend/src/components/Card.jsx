import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export function Card({ className, children, ...props }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-2xl bg-white p-6 shadow-soft border border-gray-100", className)} 
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
  return <h3 className={cn("text-xl font-semibold leading-none tracking-tight text-primary", className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn("", className)} {...props}>{children}</div>;
}
