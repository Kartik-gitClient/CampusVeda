import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, User, LogOut } from 'lucide-react';
import { logout } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markRead } from '../services/notificationApi';
import { useState } from 'react';

export function TopNav() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
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
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex flex-1 items-center justify-end space-x-4">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            {unread.length > 0 && (
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl z-50"
              >
                <h3 className="text-sm font-semibold text-primary mb-3">
                  Notifications {unread.length > 0 && <span className="ml-1 text-xs bg-black text-white px-1.5 py-0.5 rounded-full">{unread.length}</span>}
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No notifications yet.</p>
                  ) : notifications.map(n => (
                    <div
                      key={n._id}
                      onClick={() => !n.isRead && readNotif(n._id)}
                      className={`text-sm p-2 rounded-lg cursor-pointer transition-colors ${n.isRead ? 'text-gray-400 hover:bg-gray-50' : 'text-gray-700 bg-gray-50 hover:bg-gray-100 font-medium'}`}
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
            className="flex items-center space-x-2 rounded-full p-1 pr-3 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-primary font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-700 leading-none">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl z-50"
              >
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.department}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.designation}</p>
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
