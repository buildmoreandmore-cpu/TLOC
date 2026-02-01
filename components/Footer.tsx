
import React from 'react';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">T</div>
              <span className="text-2xl font-black tracking-tight">Three Level of Credit</span>
            </div>
            <p className="text-lg text-slate-500 max-w-sm leading-relaxed mb-6">
              Professional credit repair services using legally-backed dispute letters. We cite the exact federal laws that protect your rights.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              <Shield className="h-4 w-4" />
              <span>FCRA Compliant Dispute Letters</span>
            </div>
          </div>
          <div>
            <h4 className="text-black font-black uppercase text-[10px] tracking-[0.2em] mb-6">Services</h4>
            <ul className="space-y-3 text-base font-medium">
              <li><a href="/#/services" className="text-slate-500 hover:text-black transition">Bureau Disputes</a></li>
              <li><a href="/#/services" className="text-slate-500 hover:text-black transition">Identity Theft Removal</a></li>
              <li><a href="/#/services" className="text-slate-500 hover:text-black transition">Creditor Disputes</a></li>
              <li><a href="/#/services" className="text-slate-500 hover:text-black transition">Verification Letters</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-black font-black uppercase text-[10px] tracking-[0.2em] mb-6">Company</h4>
            <ul className="space-y-3 text-base font-medium">
              <li><a href="/#/" className="text-slate-500 hover:text-black transition">Home</a></li>
              <li><a href="/#/services" className="text-slate-500 hover:text-black transition">Services</a></li>
              <li><a href="/#/contact" className="text-slate-500 hover:text-black transition">Contact</a></li>
              <li><a href="/#/login" className="text-slate-500 hover:text-black transition">Client Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Three Level of Credit. All rights reserved.
          </p>
          <p className="text-slate-400 text-xs max-w-lg text-center md:text-right">
            Disclaimer: Results may vary. We do not guarantee specific credit score improvements. Credit repair takes time and depends on individual circumstances.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
