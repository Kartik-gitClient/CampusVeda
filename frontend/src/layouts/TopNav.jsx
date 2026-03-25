import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, User, LogOut } from 'lucide-react';
import { logout } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNav() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, text: 'Request #123 approved', time: '5m ago' },
    { id: 2, text: 'Conflict detected in Room A', time: '10m ago' },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex flex-1 items-center justify-end space-x-4">
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl z-50"
              >
                <h3 className="text-sm font-semibold text-primary mb-3">Notifications</h3>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                      <p>{n.text}</p>
                      <span className="text-xs text-gray-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 rounded-full p-1 pr-3 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl z-50"
              >
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
