
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const menuSections = [
    {
      title: 'Services',
      links: [
        { label: 'Credit Report Disputes', path: '/services' },
        { label: 'Inquiry Removal', path: '/services' },
        { label: 'Credit Analysis', path: '/services' },
        { label: 'Credit Building', path: '/services' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'Home', path: '/' },
        { label: 'Our Services', path: '/services' },
        { label: 'Contact', path: '/contact' },
        { label: 'Login', path: '/login' },
      ]
    },
    {
      title: 'Get Started',
      links: [
        { label: 'Free Consultation', path: '/contact' },
        { label: 'Our Approach', path: '/services' },
        { label: 'FAQs', path: '/contact' },
      ]
    },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-16 pb-8 sm:pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center font-black text-sm sm:text-base">3</div>
              <span className="text-xl sm:text-2xl font-black tracking-tight">Three Level Credit</span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-4 sm:mb-6 max-w-sm text-sm sm:text-base">
              Professional credit improvement services. Our three-level approach helps you achieve your financial goals.
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-400 font-medium">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Results-Driven Credit Solutions</span>
            </div>
          </div>

          {/* Menu Columns */}
          {menuSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold uppercase text-[10px] sm:text-xs tracking-wider mb-4 sm:mb-6">
                {section.title}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-white transition text-xs sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-slate-500 text-xs sm:text-sm">
              &copy; {currentYear} Three Level Credit. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link to="/contact" className="text-slate-500 hover:text-white transition">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-slate-500 hover:text-white transition">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-slate-500 hover:text-white transition">
                Disclaimer
              </Link>
            </div>
          </div>
          <p className="text-slate-600 text-[10px] sm:text-xs mt-3 sm:mt-4 text-center md:text-left max-w-3xl">
            Disclaimer: Results may vary. We do not guarantee specific credit score improvements. Credit repair takes time and depends on individual circumstances. We are not attorneys and do not provide legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
