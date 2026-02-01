
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black">T</div>
              <span className="text-2xl font-black tracking-tighter">Three Level of Credit</span>
            </div>
            <p className="text-xl text-slate-500 max-w-sm leading-relaxed">
              Helping individuals restore their financial health through expert credit report analysis and legal dispute strategies.
            </p>
          </div>
          <div>
            <h4 className="text-black font-black uppercase text-[10px] tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4 text-lg font-bold">
              <li><a href="/" className="text-slate-400 hover:text-black transition">Home</a></li>
              <li><a href="/#/services" className="text-slate-400 hover:text-black transition">Services</a></li>
              <li><a href="/#/resources" className="text-slate-400 hover:text-black transition">Resources</a></li>
              <li><a href="/#/contact" className="text-slate-400 hover:text-black transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-black font-black uppercase text-[10px] tracking-[0.2em] mb-8">Legal</h4>
            <ul className="space-y-4 text-lg font-bold">
              <li><a href="#" className="text-slate-400 hover:text-black transition">Privacy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-black transition">Terms</a></li>
              <li><a href="#" className="text-slate-400 hover:text-black transition">Disclosures</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-32 pt-12 border-t border-slate-50 text-slate-400 font-bold text-sm">
          <p>&copy; {new Date().getFullYear()} Three Level of Credit. Built for excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
