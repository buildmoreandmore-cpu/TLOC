
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Search, FileText, Scale, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 z-10">
              <h1 className="text-5xl md:text-7xl font-black text-black leading-[0.95] tracking-tighter mb-8">
                Your Credit Score Is a Reflection of Your Credit Report...
                <span className="text-blue-600"> Let's Fix That.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                Professional credit repair services using legally-backed dispute letters. We cite the exact federal laws that protect your rights.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition active:scale-95 shadow-xl shadow-blue-100 flex items-center gap-2">
                  Get Started Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/services" className="px-6 py-4 text-blue-600 font-bold text-lg hover:opacity-70 transition">
                  View Services
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
              <div className="relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500 rounded-xl">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">8 Letter Types</h3>
                        <p className="text-slate-500">Professional dispute letters for every situation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500 rounded-xl">
                        <Scale className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Legally Backed</h3>
                        <p className="text-slate-500">Every letter cites FCRA & federal law</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Certified Mail</h3>
                        <p className="text-slate-500">Proper documentation & tracking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -z-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Federal Law Banner */}
      <section className="py-8 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <ShieldCheck className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Your rights are protected by federal law
              </h3>
              <p className="text-slate-600">
                The Fair Credit Reporting Act (FCRA) gives you the right to dispute inaccurate information.
                These letters cite the exact laws that protect you. Credit bureaus must investigate within 30 days or remove the item.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-black mb-1">8</h3>
              <p className="text-slate-600 font-medium">Letter Types</p>
            </div>
            <div className="bg-purple-50 p-8 rounded-[2rem] border border-purple-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-4">
                <Scale className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-black mb-1">FCRA</h3>
              <p className="text-slate-600 font-medium">Legal Citations</p>
            </div>
            <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-black mb-1">30</h3>
              <p className="text-slate-600 font-medium">Day Investigation</p>
            </div>
            <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 hover:-translate-y-2 transition duration-300">
              <div className="mb-4">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-black mb-1">100%</h3>
              <p className="text-slate-600 font-medium">Certified Mail</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-4">Professional Dispute Letter Services</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">We provide 8 types of legally-backed dispute letters to address every credit repair situation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Bureau Dispute", desc: "FCRA § 1681i", color: "blue" },
              { icon: AlertTriangle, title: "Identity Theft", desc: "FCRA § 605(b)", color: "orange" },
              { icon: Search, title: "Verification", desc: "FCRA § 611(a)(7)", color: "pink" },
              { icon: FileText, title: "Creditor Dispute", desc: "FCRA § 1681s-2(b)", color: "blue" },
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition">
                <div className={`p-3 bg-${service.color}-500 rounded-xl w-fit mb-4`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1">{service.title}</h3>
                <p className="text-sm text-slate-500">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              View All 8 Services
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-black mb-4">Ready to Fix Your Credit?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get a free consultation and learn how our legally-backed dispute letters can help improve your credit report.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition">
              Get Your Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
