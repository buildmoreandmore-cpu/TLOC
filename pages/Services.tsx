
import React from 'react';
import { IconProduct, IconDigital, IconSoftware, IconStartup, IconSnowball } from '../components/Icons';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Personal Credit Audit',
      description: 'A comprehensive deep dive into your TransUnion, Equifax, and Experian reports to find every single error holding you back.',
      features: ['3-Bureau Report Pull', 'Error Identification', 'Action Plan Strategy'],
      icon: <IconProduct />,
      color: 'bg-[#fcf7f2]'
    },
    {
      title: 'Debt Snowball Strategy',
      description: 'A personalized payoff plan that builds momentum by tackling smaller debts first, leading to a lifestyle of freedom versus deprivation.',
      features: ['Smallest-to-Largest Payoff', 'Diligent Budgeting', 'Motivational Milestones'],
      icon: <IconSnowball />,
      color: 'bg-[#f7fcf2]'
    },
    {
      title: 'Inquiry Removal',
      description: 'Removing unauthorized hard inquiries that drop your score unnecessarily.',
      features: ['Excessive Inquiry Cleanup', 'Direct Bureau Outreach', 'Fast Tracking'],
      icon: <IconDigital />,
      color: 'bg-[#f7f2fc]'
    },
    {
      title: 'Collection Defense',
      description: 'Challenging collection agencies to prove their right to collect and report.',
      features: ['Debt Validation', 'C&D Letters', 'Pay-for-Delete Negotiation'],
      icon: <IconSoftware />,
      color: 'bg-[#f2f7fc]'
    },
    {
      title: 'Public Record Repair',
      description: 'Addressing bankruptcies, tax liens, and judgments that damage long-term credit health.',
      features: ['NCAP Compliance Review', 'Accuracy Verification', 'Factual Disputing'],
      icon: <IconStartup />,
      color: 'bg-[#f2fcf7]'
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-24">
          <h1 className="text-6xl font-black text-black tracking-tighter mb-8 leading-none">Our Credit Repair Services</h1>
          <p className="text-2xl text-slate-600">We don't just send "cookie-cutter" letters. We build a personalized defense for your financial reputation and a roadmap to debt-free living.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <div key={i} className={`${s.color} p-12 rounded-[3rem] card-shadow border border-white hover:scale-[1.02] transition duration-300`}>
              <div className="mb-10 scale-125 origin-left">{s.icon}</div>
              <h3 className="text-3xl font-black text-black mb-6">{s.title}</h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">{s.description}</p>
              <ul className="space-y-4">
                {s.features.map((f, j) => (
                  <li key={j} className="flex items-center text-slate-900 font-bold">
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm text-xs">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-32 bg-black rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.2),_transparent_70%)]"></div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter relative z-10">Ready for a 700+ Score?</h2>
          <p className="text-2xl text-slate-400 mb-12 max-w-xl mx-auto relative z-10">Our average client sees a 40-120 point increase within 6 months of active membership.</p>
          <a href="/#/contact" className="inline-block bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition active:scale-95 relative z-10 shadow-2xl">
            Apply to Join Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
