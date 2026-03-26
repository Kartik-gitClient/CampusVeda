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
    <aside className="w-72 p-4 hidden md:flex flex-col h-screen transition-all duration-500">
      <div className="glass rounded-[2rem] h-full flex flex-col overflow-hidden">
        <div className="flex h-20 items-center px-8 border-b border-white/10 dark:border-white/5">
          <img src={logo} alt="CampusVeda" className="mr-3 h-10 w-10 object-contain" />
          <span className="text-xl font-bold tracking-tight text-primary dark:text-white">CampusVeda</span>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path.split('/').length === 2}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300',
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-black/5 dark:shadow-white/5 translate-x-1'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white'
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
          <div className="px-6 py-6 bg-gray-50/50 dark:bg-black/20 border-t border-border">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{user.role}</p>
            <p className="text-sm font-bold text-primary dark:text-white truncate">{user.name}</p>
            {user.department && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.department}</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
