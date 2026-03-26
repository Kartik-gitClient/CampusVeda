import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export function Card({ className, children, ...props }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("glass card-hover rounded-[2rem] p-8", className)} 
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
  return <h3 className={cn("text-xl font-semibold leading-none tracking-tight text-primary dark:text-white transition-colors duration-300", className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn("", className)} {...props}>{children}</div>;
}
