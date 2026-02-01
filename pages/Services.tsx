
import React from 'react';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Personal Credit Audit',
      description: 'A comprehensive deep dive into your TransUnion, Equifax, and Experian reports to find every single error holding you back.',
      features: ['3-Bureau Report Pull', 'Error Identification', 'Action Plan Strategy']
    },
    {
      title: 'Inquiry Removal',
      description: 'Removing unauthorized hard inquiries that drop your score unnecessarily.',
      features: ['Excessive Inquiry Cleanup', 'Direct Bureau Outreach', 'Fast Tracking']
    },
    {
      title: 'Collection Defense',
      description: 'Challenging collection agencies to prove their right to collect and report.',
      features: ['Debt Validation', 'C&D Letters', 'Pay-for-Delete Negotiation']
    },
    {
      title: 'Public Record Repair',
      description: 'Addressing bankruptcies, tax liens, and judgments that damage long-term credit health.',
      features: ['NCAP Compliance Review', 'Accuracy Verification', 'Factual Disputing']
    }
  ];

  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Credit Repair Services</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">We don't just send "cookie-cutter" letters. We build a personalized defense for your financial reputation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">{s.title}</h3>
              <p className="text-slate-600 mb-6">{s.description}</p>
              <ul className="space-y-3">
                {s.features.map((f, j) => (
                  <li key={j} className="flex items-center text-sm font-medium text-slate-700">
                    <span className="text-green-500 mr-2">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready for a 700+ Score?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Our average client sees a 40-120 point increase within 6 months of active membership.</p>
          <a href="/#/contact" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition">
            Apply to Join Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
