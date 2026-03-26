import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { ChatBot } from '../components/AI/ChatBot';

export function MainLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full mesh-gradient text-foreground overflow-hidden relative transition-colors duration-500">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        
        <TopNav />
        <motion.main 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 overflow-y-auto p-4 md:p-8 md:pt-0"
        >
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
      <ChatBot />
    </div>
  );
}
