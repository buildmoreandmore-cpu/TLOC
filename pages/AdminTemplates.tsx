
import React from 'react';
import { DISPUTE_TEMPLATES } from '../constants';

const AdminTemplates: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dispute Templates</h1>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-black transition text-sm">
          + Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DISPUTE_TEMPLATES.map((template) => (
          <div key={template.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-900">{template.name}</h3>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase">System</span>
            </div>
            <p className="text-sm text-slate-500 mb-6 min-h-[3rem]">{template.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button className="text-blue-600 text-xs font-bold hover:underline">Edit Content</button>
              <button className="text-slate-400 text-xs font-bold hover:text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTemplates;
