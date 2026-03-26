import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Building2,
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Settings,
  Users,
  ClipboardList,
} from 'lucide-react';
import { cn } from '../utils/cn';
import logo from '../assets/logo.png';

// Roles match backend schema: 'junior' | 'senior' | 'hod'
const getNavItems = (role) => {
  switch (role) {
    case 'junior':
      return [
        { name: 'Dashboard', path: '/junior', icon: LayoutDashboard },
        { name: 'Building Map', path: '/building-map', icon: Building2 },
        { name: 'My Requests', path: '/junior/requests', icon: FileText },
      ];
    case 'senior':
      return [
        { name: 'Dashboard', path: '/senior', icon: LayoutDashboard },
        { name: 'Building Map', path: '/building-map', icon: Building2 },
        { name: 'Approval Queue', path: '/senior/queue', icon: ClipboardList },
        { name: 'Conflicts', path: '/senior/conflicts', icon: AlertTriangle },
      ];
    case 'hod':
      return [
        { name: 'Dashboard', path: '/hod', icon: LayoutDashboard },
        { name: 'Building Map', path: '/building-map', icon: Building2 },
        { name: 'Escalations', path: '/hod/escalations', icon: AlertTriangle },
        { name: 'Resources', path: '/hod/resources', icon: Building2 },
        { name: 'Audit Log', path: '/hod/audit', icon: Users },
        { name: 'Settings', path: '/hod/settings', icon: Settings },
      ];
    default:
      return [];
  }
};

export function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const items = user ? getNavItems(user.role) : [];

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-screen flex flex-col transition-colors duration-300">
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <img src={logo} alt="CampusVeda" className="mr-3 h-8 w-8 object-contain" />
        <span className="text-base font-bold tracking-tight text-primary dark:text-white">CampusVeda</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path.split('/').length === 2} // exact match for root paths
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary dark:text-white translate-x-1'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-primary dark:hover:text-white hover:translate-x-1'
                )
              }
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      {user && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase">{user.role}</p>
          <p className="text-sm font-semibold text-primary dark:text-white truncate">{user.name}</p>
          {user.department && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.department}</p>
          )}
        </div>
      )}
    </aside>
  );
}
