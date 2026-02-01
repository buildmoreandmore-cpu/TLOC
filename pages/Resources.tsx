
import React from 'react';

const Resources: React.FC = () => {
  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Credit Resources</h1>
        <p className="text-slate-600 mb-12 text-center text-lg">Knowledge is power. Use these trusted tools to monitor and manage your credit reports.</p>
        
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">AnnualCreditReport.com</h2>
              <p className="text-slate-600 mb-6">The only official site to get your free annual credit reports from TransUnion, Equifax, and Experian as authorized by Federal law.</p>
              <a 
                href="https://www.annualcreditreport.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
              >
                Get Free Report
              </a>
            </div>
            <div className="w-full md:w-48 h-32 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400 font-bold">
              OFFICIAL
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">IdentityIQ</h2>
              <p className="text-slate-600 mb-6">Our preferred credit monitoring service. It provides all three scores and reports every 30 days, making it perfect for tracking repair progress.</p>
              <a 
                href="https://www.identityiq.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-slate-800 text-white px-6 py-2 rounded font-semibold hover:bg-slate-900"
              >
                Sign Up for Monitoring
              </a>
            </div>
            <div className="w-full md:w-48 h-32 bg-blue-50 flex items-center justify-center rounded-lg text-blue-600 font-bold">
              MONITORING
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Important Consumer Laws</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-white p-4 rounded-lg border border-blue-100 text-sm">
                <span className="font-bold block mb-1">FCRA</span>
                Fair Credit Reporting Act ensures accuracy, fairness, and privacy of information in consumer reports.
              </li>
              <li className="bg-white p-4 rounded-lg border border-blue-100 text-sm">
                <span className="font-bold block mb-1">FDCPA</span>
                Fair Debt Collection Practices Act protects you from abusive or deceptive debt collection behaviors.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
