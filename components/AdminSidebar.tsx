
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  onLogout: () => void;
}

const AdminSidebar: React.FC<Props> = ({ onLogout }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800';

  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: '📊' },
    { label: 'Clients', path: '/dashboard/clients', icon: '👥' },
    { label: 'Generated Letters', path: '/dashboard/letters', icon: '✉️' },
    { label: 'Templates', path: '/dashboard/templates', icon: '📄' },
    { label: 'Credit Building', path: '/dashboard/credit-building', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-slate-900 flex flex-col h-full shadow-xl">
      <div className="p-6">
        <h2 className="text-white text-xl font-bold">TLC Admin</h2>
        <p className="text-slate-400 text-xs mt-1">Three Level of Credit Portal</p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(item.path)}`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Link to="/" className="block w-full text-center py-2 text-slate-400 hover:text-white mb-4 text-sm">
          Return to Site
        </Link>
        <button
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
