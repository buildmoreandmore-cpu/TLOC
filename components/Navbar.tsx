
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'text-black font-semibold' : 'text-slate-600 hover:text-black transition';

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black group-hover:scale-110 transition">T</div>
              <span className="text-xl font-extrabold tracking-tight text-black">Three Level of Credit</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/services" className={isActive('/services')}>Services</Link>
              <Link to="/resources" className={isActive('/resources')}>Resources</Link>
              <Link to="/contact" className={isActive('/contact')}>Contact</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-900 font-semibold px-4 hover:opacity-70 transition">Client Login</Link>
            <Link to="/contact" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition active:scale-95">Free Consultation</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
