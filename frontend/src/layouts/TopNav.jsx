import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markRead } from '../services/notificationApi';
import { useState } from 'react';
import logo from '../assets/logo.png';

export function TopNav() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    retry: 1,
    refetchInterval: 30000, // refresh every 30s
  });

  const { mutate: readNotif } = useMutation({
    mutationFn: markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = notifications.filter(n => !n.isRead);

  return (
    <div className="p-4 md:pl-0 md:pr-6 md:pt-6">
      <header className="glass rounded-[2rem] h-20 flex items-center justify-between px-8 transition-all duration-500">
        <div className="flex items-center md:hidden">
          <img src={logo} alt="CampusVeda" className="h-10 w-10 object-contain" />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-3 md:space-x-4">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            {unread.length > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-gray-900" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-xl z-50"
              >
                <h3 className="text-sm font-semibold text-primary dark:text-white mb-3">
                  Notifications {unread.length > 0 && <span className="ml-1 text-xs bg-black dark:bg-primary text-white px-1.5 py-0.5 rounded-full">{unread.length}</span>}
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No notifications yet.</p>
                  ) : notifications.map(n => (
                    <div
                      key={n._id}
                      onClick={() => !n.isRead && readNotif(n._id)}
                      className={`text-sm p-2 rounded-lg cursor-pointer transition-colors ${n.isRead ? 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50' : 'text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium'}`}
                    >
                      <p>{n.message}</p>
                      <span className="text-xs text-gray-400">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
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
            className="flex items-center space-x-2 rounded-full p-1 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-primary dark:text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 shadow-xl z-50"
              >
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{user?.department}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{user?.designation}</p>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
    </div>
  );
}
