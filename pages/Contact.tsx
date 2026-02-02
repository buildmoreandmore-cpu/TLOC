
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-12 md:py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tighter leading-none mb-6">Get Your Free Analysis</h1>
            <p className="text-lg sm:text-xl text-slate-500 mb-8 max-w-lg leading-relaxed">Fill out the form below and a credit expert will reach out within 24 hours to start your recovery.</p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">📧</div>
                <div>
                  <h4 className="font-black text-black text-sm sm:text-base">Email support</h4>
                  <p className="text-slate-500 text-sm sm:text-base">support@threelevelcredit.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-lg">📞</div>
                <div>
                  <h4 className="font-black text-black text-sm sm:text-base">Call us</h4>
                  <p className="text-slate-500 text-sm sm:text-base">+1 (800) 555-0123</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {sent ? (
              <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl text-center card-shadow border border-slate-50 animate-in fade-in zoom-in">
                <div className="text-5xl sm:text-6xl mb-6">🚀</div>
                <h2 className="text-2xl sm:text-3xl font-black text-black mb-4">Message Received!</h2>
                <p className="text-base sm:text-lg text-slate-500 mb-8 leading-relaxed">Thank you for reaching out. We'll be in touch very soon to start your journey.</p>
                <button
                  onClick={() => setSent(false)}
                  className="bg-black text-white px-8 py-3 rounded-xl font-black hover:scale-105 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl card-shadow border border-slate-100 space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition text-base" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition text-base" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                  <input required type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition text-base" placeholder="(555) 000-0000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Type</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition appearance-none text-base">
                    <option>Full Credit Repair</option>
                    <option>Inquiry Removal</option>
                    <option>Debt Negotiation</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message (Optional)</label>
                  <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition resize-none text-base" placeholder="Tell us a bit about your situation..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-xl hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-100">
                  Submit Request
                </button>
              </form>
            )}
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
