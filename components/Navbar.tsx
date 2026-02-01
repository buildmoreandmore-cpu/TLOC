
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path ? 'text-black font-semibold' : 'text-slate-600 hover:text-black transition';

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services', hasDropdown: true },
    { label: 'Contact', path: '/contact' },
  ];

  const serviceItems = [
    { label: 'Bureau Disputes', description: 'Challenge inaccurate credit report items', path: '/services#bureau' },
    { label: 'Identity Theft Removal', description: 'Remove fraudulent accounts', path: '/services#identity' },
    { label: 'Creditor Disputes', description: 'Dispute directly with furnishers', path: '/services#creditor' },
    { label: 'Late Payment Removal', description: 'Goodwill and dispute letters', path: '/services#late' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black group-hover:scale-110 transition">3</div>
            <span className="text-xl font-extrabold tracking-tight text-black hidden sm:block">Three Level Credit</span>
            <span className="text-xl font-extrabold tracking-tight text-black sm:hidden">3LC</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              item.hasDropdown ? (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg flex items-center gap-1 ${isActive(item.path)} hover:bg-slate-50`}
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                  </Link>

                  {/* Dropdown */}
                  {servicesDropdownOpen && (
                    <div className="absolute top-full left-0 pt-2 w-72">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                        {serviceItems.map((service) => (
                          <Link
                            key={service.path}
                            to={service.path}
                            className="block px-4 py-3 hover:bg-slate-50 transition"
                          >
                            <div className="font-semibold text-slate-900">{service.label}</div>
                            <div className="text-sm text-slate-500">{service.description}</div>
                          </Link>
                        ))}
                        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
                          <Link to="/services" className="text-blue-600 font-semibold text-sm hover:text-blue-700">
                            View All Services →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg ${isActive(item.path)} hover:bg-slate-50`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="text-slate-700 font-semibold px-4 py-2 hover:text-black transition">
              Client Login
            </Link>
            <Link to="/contact" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition active:scale-95">
              Free Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-black hover:bg-slate-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100">
          <div className="px-6 py-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium ${isActive(item.path)} hover:bg-slate-50`}
                >
                  {item.label}
                </Link>
                {item.hasDropdown && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-4">
                    {serviceItems.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-slate-500 hover:text-black text-sm"
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Client Login
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
              >
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
