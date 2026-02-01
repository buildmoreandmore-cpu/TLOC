
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">Three Level of Credit</h3>
            <p className="max-w-xs">Helping individuals restore their financial health through expert credit report analysis and legal dispute strategies.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-400">Home</a></li>
              <li><a href="/#/services" className="hover:text-blue-400">Services</a></li>
              <li><a href="/#/resources" className="hover:text-blue-400">Resources</a></li>
              <li><a href="/#/contact" className="hover:text-blue-400">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400">CROA Disclosures</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Three Level of Credit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
