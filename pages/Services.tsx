
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Search, RotateCcw, EyeOff, CreditCard, FileText, ScrollText, ShieldCheck, Scale, CheckCircle, ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const letterServices = [
    {
      icon: Shield,
      color: "bg-blue-500",
      title: "Bureau Dispute Letters",
      legalBasis: "FCRA § 1681i, § 1681e(b)",
      description: "Dispute inaccurate information directly with credit bureaus. This is the foundation of credit repair - challenging errors, incomplete information, and unverifiable items.",
      features: [
        "Dispute errors with Equifax, Experian, and TransUnion",
        "Challenge inaccurate account information",
        "Remove outdated negative items",
        "30-day investigation requirement",
      ],
    },
    {
      icon: AlertTriangle,
      color: "bg-orange-500",
      title: "Identity Theft Inquiry Removal",
      legalBasis: "FCRA § 605(b), § 615(f)",
      description: "Remove fraudulent hard inquiries resulting from identity theft or unauthorized access. Protects your credit from inquiries you never authorized.",
      features: [
        "Remove unauthorized hard inquiries",
        "Identity theft documentation support",
        "Fraud alert placement assistance",
        "4-day blocking requirement for fraud",
      ],
    },
    {
      icon: Search,
      color: "bg-pink-500",
      title: "Method of Verification Letters",
      legalBasis: "FCRA § 611(a)(7)",
      description: "Demand disclosure of how disputed items were verified during investigation. Forces bureaus to explain exactly how they determined accuracy.",
      features: [
        "Demand furnisher contact information",
        "Request verification documentation",
        "Challenge generic 'verified' responses",
        "15-day response requirement",
      ],
    },
    {
      icon: RotateCcw,
      color: "bg-orange-500",
      title: "Re-insertion Violation Letters",
      legalBasis: "FCRA § 611(a)(5)(B)",
      description: "Challenge improperly re-inserted items that were previously deleted. The law requires notification before re-insertion.",
      features: [
        "Challenge items that reappear after deletion",
        "Demand certification documentation",
        "Require proof of 5-day notification",
        "Statutory damages potential ($100-$1,000)",
      ],
    },
    {
      icon: EyeOff,
      color: "bg-teal-500",
      title: "Opt-Out Letters",
      legalBasis: "15 USC § 6802(b), FCRA § 604(c)",
      description: "Exercise your privacy rights to stop prescreened credit offers, limit affiliate sharing, and control how your data is used.",
      features: [
        "Stop prescreened credit offers",
        "Limit affiliate data sharing",
        "Block third-party marketing",
        "Reduce identity theft exposure",
      ],
    },
    {
      icon: CreditCard,
      color: "bg-blue-500",
      title: "Creditor Dispute Letters",
      legalBasis: "FCRA § 1681s-2(b), FDCPA § 1692e",
      description: "Dispute inaccurate reporting directly with the original creditor or furnisher. Creditors have a duty to investigate and correct.",
      features: [
        "Dispute late payment reporting",
        "Challenge incorrect balances",
        "Correct account status errors",
        "Multi-bureau correction reporting",
      ],
    },
    {
      icon: FileText,
      color: "bg-purple-500",
      title: "Sworn Affidavits",
      legalBasis: "Notarized sworn statements",
      description: "Identity verification and dispute affidavits for formal legal documentation. Sworn statements carry significant legal weight.",
      features: [
        "Identity verification affidavits",
        "Late payment dispute affidavits",
        "Notarized documentation",
        "Supports litigation if needed",
      ],
    },
    {
      icon: ScrollText,
      color: "bg-slate-600",
      title: "Service Agreement Package",
      legalBasis: "CROA 15 U.S.C. § 1679",
      description: "CROA-compliant credit repair service agreement with all legally required disclosures, cancellation rights, and consumer protections.",
      features: [
        "Full CROA compliance",
        "Required consumer disclosures",
        "3-day cancellation rights",
        "Clear service terms",
      ],
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hero */}
        <div className="max-w-4xl mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter mb-6 leading-none">
            Professional Credit Repair Services
          </h1>
          <p className="text-xl text-slate-600">
            We provide 8 types of legally-backed dispute letters designed to address every credit repair situation.
            Each letter cites specific federal laws that protect your rights.
          </p>
        </div>

        {/* Federal Law Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-16 flex items-start gap-4">
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {letterServices.map((service, index) => (
            <div key={index} className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl transition duration-300">
              <div className={`${service.color} p-4 rounded-2xl w-fit mb-6`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-black mb-2">{service.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">{service.legalBasis}</span>
              </div>
              <p className="text-slate-600 mb-6">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <h2 className="text-3xl font-black text-center mb-12">How Our Process Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Free Consultation", desc: "We review your credit reports and identify disputable items" },
              { step: "2", title: "Letter Selection", desc: "We determine which letter types will be most effective" },
              { step: "3", title: "Professional Dispatch", desc: "Letters sent via certified mail with tracking" },
              { step: "4", title: "Results & Follow-up", desc: "Monitor responses and escalate as needed" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Fix Your Credit?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get a free consultation and learn how our legally-backed dispute letters can help improve your credit report.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-yellow-400 text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-yellow-300 transition">
            Get Your Free Consultation
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
