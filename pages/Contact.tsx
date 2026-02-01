
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-32 items-start">
          <div>
            <h1 className="text-7xl font-black text-black tracking-tighter leading-none mb-10">Get Your Free Analysis</h1>
            <p className="text-2xl text-slate-500 mb-12 max-w-lg leading-relaxed">Fill out the form below and a credit expert will reach out within 24 hours to start your recovery.</p>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">📧</div>
                <div>
                  <h4 className="font-black text-black">Email support</h4>
                  <p className="text-slate-500">support@threelevelcredit.com</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl">📞</div>
                <div>
                  <h4 className="font-black text-black">Call us</h4>
                  <p className="text-slate-500">+1 (800) 555-0123</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {sent ? (
              <div className="bg-white p-12 rounded-[3rem] text-center card-shadow border border-slate-50 animate-in fade-in zoom-in">
                <div className="text-7xl mb-8">🚀</div>
                <h2 className="text-4xl font-black text-black mb-4">Message Received!</h2>
                <p className="text-xl text-slate-500 mb-10 leading-relaxed">Thank you for reaching out. We'll be in touch very soon to start your journey.</p>
                <button 
                  onClick={() => setSent(false)}
                  className="bg-black text-white px-10 py-4 rounded-2xl font-black hover:scale-105 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3rem] card-shadow border border-slate-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <input required type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                  <input required type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition" placeholder="(555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Type</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition appearance-none">
                    <option>Full Credit Repair</option>
                    <option>Inquiry Removal</option>
                    <option>Debt Negotiation</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message (Optional)</label>
                  <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition resize-none" placeholder="Tell us a bit about your situation..."></textarea>
                </div>
                <button type="submit" className="w-full py-6 bg-blue-600 text-white font-black text-xl rounded-[1.5rem] hover:bg-blue-700 transition active:scale-95 shadow-2xl shadow-blue-100">
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
