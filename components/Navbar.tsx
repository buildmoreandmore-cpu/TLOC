
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-semibold' : 'text-slate-600';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold text-blue-800 flex items-center">
              <span className="bg-blue-600 text-white p-1 px-2 rounded mr-2">T</span>
              Three Level of Credit
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/services" className={isActive('/services')}>Services</Link>
            <Link to="/resources" className={isActive('/resources')}>Resources</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
