
import React from 'react';
import { DisputeLetter } from '../types';

interface Props {
  letters: DisputeLetter[];
}

const AdminLetters: React.FC<Props> = ({ letters }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-slate-800">Generated Letters Repository</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {letters.map((letter) => (
          <div key={letter.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900">{letter.clientName}</h3>
                <p className="text-xs text-slate-500">Created: {letter.createdAt}</p>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                letter.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {letter.status}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex-1 overflow-hidden h-48 mb-6 relative">
              <div className="text-[10px] font-serif whitespace-pre-wrap text-slate-600">
                {letter.content}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition">
                View PDF
              </button>
              <button className="flex-1 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition">
                Mark as Sent
              </button>
            </div>
          </div>
        ))}

        {letters.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
            <p className="text-slate-400">No letters have been generated yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLetters;
