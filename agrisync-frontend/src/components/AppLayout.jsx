import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import {
  HomeIcon,
  UsersIcon,
  LeafIcon,
  ClipboardListIcon,
  DollarSignIcon,
  MapPinIcon,
  ArchiveIcon,
  LogOutIcon,
} from './icons';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { navigate, route } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: 'dashboard', icon: HomeIcon, roles: ['admin', 'worker'] },
    { name: 'Fields', path: 'fields', icon: MapPinIcon, roles: ['admin'] },
    { name: 'Crops', path: 'crops', icon: LeafIcon, roles: ['admin'] },
    { name: 'Tasks', path: 'tasks', icon: ClipboardListIcon, roles: ['admin', 'worker'] },
    { name: 'Finance', path: 'finance', icon: DollarSignIcon, roles: ['admin'] },
    { name: 'Inventory', path: 'inventory', icon: ArchiveIcon, roles: ['admin'] },
    { name: 'Users', path: 'users', icon: UsersIcon, roles: ['admin'] },
  ];

  const getInitials = (username) => {
    if (!username) return '?';
    const parts = username.split(' ');
    if (parts.length > 1) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50 font-inter relative">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full z-30 bg-slate-800 text-slate-100 flex-shrink-0 flex flex-col shadow-lg transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}
      >
        <div className="h-20 flex items-center justify-center border-b border-slate-700">
          <LeafIcon className="w-8 h-8 text-green-400 mr-2" />
          <h1 className="text-2xl font-semibold tracking-tight">AgriSync</h1>
        </div>
        <nav className="flex-grow p-4 space-y-1.5">
          {navItems.map(
            (item) =>
              user &&
              item.roles.includes(user.role) && (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out group
                    ${route === item.path
                      ? 'bg-green-500 text-white shadow-md'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'}`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      route === item.path
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-green-400'
                    }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              )
          )}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3">
              {getInitials(user?.username)}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">{user?.username}</div>
              <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2.5 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-red-500 hover:text-white text-slate-300 transition-colors duration-200 group"
          >
            <LogOutIcon className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* Mobile sidebar toggle button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h2 className="text-xl font-semibold text-gray-700 capitalize">
            {route.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </h2>
        </header>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
