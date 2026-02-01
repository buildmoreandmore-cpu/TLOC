
import React from 'react';
import { Link } from 'react-router-dom';
import { IconProduct, IconDigital, IconSoftware, IconStartup } from '../components/Icons';

const Landing: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 z-10">
              <h1 className="text-6xl md:text-8xl font-black text-black leading-[0.9] tracking-tighter mb-8">
                Your company's operating system
              </h1>
              <p className="text-2xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                Three Level of Credit is a work platform that replaces scattered tools and connects teams. Chosen by nerds, appreciated by everyone.*
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-xl hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-100">
                  Sign up for free
                </Link>
                <Link to="/services" className="px-6 py-4 text-blue-600 font-bold text-xl hover:opacity-70 transition">
                  Book a demo
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
              <div className="relative z-10 scale-110 translate-x-8">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=600" 
                  alt="Interface Preview" 
                  className="rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100"
                />
              </div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - Fibery Style */}
      <section className="pb-32 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#fcf7f2] p-8 rounded-[2rem] card-shadow border border-white hover:-translate-y-2 transition duration-300">
              <div className="mb-8"><IconProduct /></div>
              <h3 className="text-2xl font-black mb-2">Product</h3>
              <p className="text-slate-500 text-sm">10k+ Items Removed</p>
            </div>
            <div className="bg-[#f7f2fc] p-8 rounded-[2rem] card-shadow border border-white hover:-translate-y-2 transition duration-300">
              <div className="mb-8"><IconDigital /></div>
              <h3 className="text-2xl font-black mb-2">Digital agency</h3>
              <p className="text-slate-500 text-sm">95% Success Rate</p>
            </div>
            <div className="bg-[#f2f7fc] p-8 rounded-[2rem] card-shadow border border-white hover:-translate-y-2 transition duration-300">
              <div className="mb-8"><IconSoftware /></div>
              <h3 className="text-2xl font-black mb-2">Software</h3>
              <p className="text-slate-500 text-sm">45 Avg. Score Boost</p>
            </div>
            <div className="bg-[#f2fcf7] p-8 rounded-[2rem] card-shadow border border-white hover:-translate-y-2 transition duration-300 relative overflow-hidden">
               <div className="absolute top-8 right-8 bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase">6 months for free</div>
              <div className="mb-8"><IconStartup /></div>
              <h3 className="text-2xl font-black mb-2">Startup</h3>
              <p className="text-slate-500 text-sm">24/7 Client Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Tagline */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight mb-8">Your Credit Score Is a Reflection of Your Credit Report... Let's Fix That</h2>
            <p className="text-xl text-slate-500">Stop living with bad credit. At Three Level of Credit, we use aggressive legal strategies to remove inaccuracies from your credit report and boost your scores fast.</p>
          </div>
        </div>
      </section>

      {/* Cookie / Legal bar style footer item */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 z-50">
        <p className="text-sm text-slate-600 px-4">
          Fibery uses cookies to offer you a better experience. Check our <strong>cookie policy</strong> for more info.
        </p>
        <div className="flex gap-2">
          <button className="px-6 py-2 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition">Reject All</button>
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition">Accept All</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
