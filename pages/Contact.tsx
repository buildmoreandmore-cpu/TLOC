
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get Your Free Analysis</h1>
          <p className="text-slate-600">Fill out the form below and a credit expert will reach out within 24 hours.</p>
        </div>

        {sent ? (
          <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Message Received!</h2>
            <p className="text-green-700">Thank you for reaching out. We'll be in touch very soon to start your journey to financial freedom.</p>
            <button 
              onClick={() => setSent(false)}
              className="mt-6 text-green-800 font-semibold underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input required type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(555) 000-0000" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">How can we help?</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Full Credit Repair</option>
                <option>Inquiry Removal</option>
                <option>Debt Negotiation</option>
                <option>General Question</option>
              </select>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-1">Message (Optional)</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tell us a bit about your situation..."></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
