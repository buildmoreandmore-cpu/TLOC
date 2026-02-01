
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Your Credit Score Is a Reflection of Your Credit Report... <br/>
                <span className="text-blue-600">Let's Fix That</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-lg">
                Stop living with bad credit. At Three Level of Credit, we use aggressive legal strategies to remove inaccuracies from your credit report and boost your scores fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition text-center">
                  Start Your Consultation
                </Link>
                <Link to="/services" className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition text-center">
                  See How We Help
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=600&h=400" 
                alt="Credit Freedom" 
                className="rounded-2xl shadow-2xl rotate-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">10k+</p>
              <p className="text-slate-600">Items Removed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">95%</p>
              <p className="text-slate-600">Success Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">45</p>
              <p className="text-slate-600">Avg. Score Boost</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">24/7</p>
              <p className="text-slate-600">Client Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Three Level of Credit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">🛡️</div>
              <h3 className="text-xl font-bold mb-4">Legal Protection</h3>
              <p className="text-slate-600">We leverage FCRA, FDCPA, and HIPAA laws to hold credit bureaus accountable.</p>
            </div>
            <div className="p-8 border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">⚡</div>
              <h3 className="text-xl font-bold mb-4">Fast Results</h3>
              <p className="text-slate-600">Clients typically see their first deletions in as little as 35-45 days.</p>
            </div>
            <div className="p-8 border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">📱</div>
              <h3 className="text-xl font-bold mb-4">Transparent Portal</h3>
              <p className="text-slate-600">Login anytime to see exactly what we are working on and your progress.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
